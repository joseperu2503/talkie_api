import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginType, LoginUserDto } from '../dto/login-user-dto';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import { Country } from 'src/countries/entities/country.entity';
import { UsersService } from 'src/users/services/users.service';
import { TwilioService } from 'src/twilio/services/twilio.service';
import { PhoneDto } from '../dto/phone.dto';
import { VerifyCodeDto } from '../dto/verify-code.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    private readonly twilioService: TwilioService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const { password, email, phone, username, ...userData } = registerUserDto;

      // Validar si el email ya existe
      const emailExists = await this.userRepository.findOne({
        where: { email },
      });

      if (emailExists) {
        throw new BadRequestException(`The email ${email} is already in use.`);
      }

      // Validar si el username ya existe
      const usernameExists = await this.userRepository.findOne({
        where: { username },
      });

      if (usernameExists) {
        throw new BadRequestException(
          `The username ${username} is already in use.`,
        );
      }

      //** Validar si existe el country */
      const country = await this.countryRepository.findOne({
        where: { id: phone.countryId },
      });

      if (!country) {
        throw new NotFoundException(
          `Phone Country with ID ${phone.countryId} not found.`,
        );
      }

      //** Validar si la combinación phone + phoneCountry ya existe */
      const phoneExists = await this.userRepository.findOne({
        where: {
          phone: phone.number,
          phoneCountry: { id: phone.countryId },
        },
        relations: ['phoneCountry'], // Asegurar que las relaciones se carguen para la consulta
      });

      if (phoneExists) {
        throw new BadRequestException(
          `The phone number ${phone.number} with country ID ${phone.countryId} is already in use.`,
        );
      }

      // Crear el usuario
      const user = this.userRepository.create({
        ...userData,
        email,
        phone: phone.number,
        username,
        password: bcrypt.hashSync(password, 10),
        phoneCountry: country,
      });

      // Guardar el usuario
      await this.userRepository.save(user);

      // Retornar la respuesta
      const me = await this.usersService.profile(user.id);
      return { user: me, token: this.getJwt({ id: user.id }) };
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(error.message);
      }
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email, phone, type } = loginUserDto;

    let user: User | null = null;

    // Buscar usuario por email o (phone y phoneCountry)
    if (type == LoginType.EMAIL) {
      user = await this.userRepository.findOne({
        where: { email },
      });
    } else {
      const phoneProcessed = phone.number.replaceAll(' ', '');

      user = await this.userRepository.findOne({
        where: {
          phone: phoneProcessed,
          phoneCountry: { id: phone.countryId },
        },
        relations: ['phoneCountry'], // Asegurar que se cargue la relación
      });
    }

    // Si no se encontró el usuario
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    // Verificar contraseña
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    // Obtener información del perfil
    const me = await this.usersService.profile(user.id);

    // Retornar usuario y token JWT
    return { user: me, token: this.getJwt({ id: user.id }) };
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async sendVerificationCode(phone: PhoneDto) {
    try {
      //** Validar si existe el country */
      const country = await this.countryRepository.findOne({
        where: { id: phone.countryId },
      });

      if (!country) {
        throw new NotFoundException(
          `Phone Country with ID ${phone.countryId} not found.`,
        );
      }

      const phoneString: string = `${country.dialCode}${phone.number}`;

      await this.twilioService.sendVerificationCode(phoneString);
      return { success: true, message: 'Verification code sent' };
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(
          'Failed to send verification code',
        );
      }
      throw error;
    }
  }

  // Método para verificar el código ingresado por el usuario
  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    try {
      const { phone, code } = verifyCodeDto;
      //** Validar si existe el country */
      const country = await this.countryRepository.findOne({
        where: { id: phone.countryId },
      });

      if (!country) {
        throw new NotFoundException(
          `Phone Country with ID ${phone.countryId} not found.`,
        );
      }

      const phoneString: string = `${country.dialCode}${phone.number}`;

      const verificationCheck = await this.twilioService.checkVerificationCode(
        phoneString,
        code,
      );

      if (verificationCheck) {
        return { success: true, message: 'Phone number verified successfully' };
      } else {
        throw new BadRequestException('Invalid verification code');
      }
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(
          'Failed to check verification code',
        );
      }
      throw error;
    }
  }

  async verifyPhone(phone: PhoneDto) {
    try {
      const phoneProcessed = phone.number.replaceAll(' ', '');

      // Buscar usuario por número de teléfono y país
      const user = await this.userRepository.findOne({
        where: {
          phone: phoneProcessed,
          phoneCountry: { id: phone.countryId },
        },
        relations: ['phoneCountry'], // Cargar la relación para asegurarse de que se verifica correctamente
      });

      return { success: true, exists: !!user };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to verify user by phone and country',
      );
    }
  }
}
