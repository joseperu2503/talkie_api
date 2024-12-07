import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthMethod, LoginUserDto } from '../dto/login-user-dto';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import { Country } from 'src/countries/entities/country.entity';
import { UsersService } from 'src/users/services/users.service';
import { TwilioService } from 'src/twilio/services/twilio.service';
import { PhoneDto } from '../dto/phone.dto';
import { VerifyCodeDto } from '../dto/verify-code.dto';
import { CountriesService } from 'src/countries/services/countries.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,

    private readonly countriesService: CountriesService,

    private readonly twilioService: TwilioService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const { password, email, phone, type, ...userData } = registerUserDto;

      // Crear el usuario
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      if (type == AuthMethod.EMAIL) {
        //** Validar si existe el email */
        await this.findEmail(email!, true);

        user.email = email!;
      } else {
        //** Validar si existe el phone */
        const result = await this.findPhone(registerUserDto.phone!, true);

        user.phone = result.phone;
        user.phoneCountry = result.country;
      }

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
    if (type == AuthMethod.EMAIL) {
      user = await this.userRepository.findOne({
        where: { email },
      });
    } else {
      const phoneProcessed = phone!.number.replaceAll(' ', '');

      user = await this.userRepository.findOne({
        where: {
          phone: phoneProcessed,
          phoneCountry: { id: phone!.countryId },
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
      const country: Country = await this.countriesService.findOneWithExeption(
        phone!.countryId,
      );

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
      const country: Country = await this.countriesService.findOneWithExeption(
        phone!.countryId,
      );

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
      const result = await this.findPhone(phone);

      return { success: true, exists: result.exist };
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(
          'Failed to verify user by phone and country',
        );
      }
      throw error;
    }
  }

  async findEmail(email: string, throwErrorIfExist = false) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user && throwErrorIfExist) {
      throw new BadRequestException(`The email ${email} is already in use.`);
    }

    return user;
  }

  async findPhone(phone: PhoneDto, throwErrorIfExist = false) {
    try {
      const phoneProcessed = phone!.number.replaceAll(' ', '');

      //** Validar si existe el country */
      const country: Country = await this.countriesService.findOneWithExeption(
        phone.countryId,
      );

      if (!country) {
        return { exist: false, country: null, phone: phoneProcessed };
      }

      const phoneExists = await this.userRepository.findOne({
        where: {
          phone: phoneProcessed,
          phoneCountry: { id: phone.countryId },
        },
        relations: ['phoneCountry'], // Asegurar que las relaciones se carguen para la consulta
      });

      if (throwErrorIfExist && phoneExists) {
        throw new BadRequestException(
          `The phone number ${country.dialCode} ${phone!.number} is already in use.`,
        );
      }

      return { exist: !!phoneExists, country: country, phone: phoneProcessed };
    } catch (error) {
      throw error;
    }
  }
}
