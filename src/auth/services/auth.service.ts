import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Country } from 'src/countries/entities/country.entity';
import { CountriesService } from 'src/countries/services/countries.service';
import { MailService } from 'src/mail/services/mail.service';
import { TwilioService } from 'src/twilio/services/twilio.service';
import { UsersService } from 'src/users/services/users.service';
import { VerificationCodesService } from 'src/verification-codes/services/verification-codes.service';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { AuthMethod, LoginRequest } from '../dto/login-request.dto';
import { PhoneDto } from '../dto/phone.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { VerificationcodeDto } from '../dto/verification-code.dto';
import { VerifyAccountDto } from '../dto/verify-account.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,

    private readonly countriesService: CountriesService,

    private readonly twilioService: TwilioService,

    private readonly mailService: MailService,

    private readonly verificationCodesService: VerificationCodesService,
  ) {}

  async register(registerUserDto: RegisterRequestDto): Promise<AuthResponseDto> {
    try {
      const { password, email, phone, type, verificationCode, ...userData } =
        registerUserDto;

      //** Crear el usuario */
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      //** Aignar email o telefono */
      if (type == AuthMethod.EMAIL) {
        //** Validar si existe el email */
        await this._findEmail(email!, true);

        user.email = email!;
      } else {
        //** Validar si existe el phone */
        const result = await this._findPhone(registerUserDto.phone!, true);

        user.phone = result.phone;
        user.phoneCountry = result.country;
      }

      //** verificar codigo 4 digitos */
      if (verificationCode) {
        await this.verificationCodesService.verify(verificationCode, false);
      }

      //** Guardar el usuario */
      await this.userRepository.save(user);

      return this.buildAuthResponse(user);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(error.message);
      }
      throw error;
    }
  }

  async login(loginUserDto: LoginRequest): Promise<AuthResponseDto> {
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

    return this.buildAuthResponse(user);
  }

  async sendVerificationCode(verifyAccountDto: VerifyAccountDto) {
    try {
      const { phone, type, email } = verifyAccountDto;

      const verificationCode = await this.verificationCodesService.create();

      if (type == AuthMethod.EMAIL) {
        await this.mailService.sendVerificationCode(
          email!,
          verificationCode.code,
        );
      } else {
        //** Validar si existe el country */
        const country: Country =
          await this.countriesService.findOneWithExeption(phone!.countryId);

        const phoneString: string = `${country.dialCode}${phone!.number}`;

        //** Enviar sms con Twilio */
        if (process.env.TWILIO_ENABLED) {
          await this.twilioService.sendVerificationCode(
            phoneString,
            verificationCode.code,
          );
        }
      }

      return {
        success: true,
        message: 'Verification code sent',
        data: {
          verificationCodeId: verificationCode.id,
        },
      };
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
  async verifyCode(verifyCodeDto: VerificationcodeDto) {
    try {
      await this.verificationCodesService.verify(verifyCodeDto);

      return { success: true, message: 'Code verified successfully' };
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(
          'Failed to check verification code',
        );
      }
      throw error;
    }
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    try {
      const { phone, type, email } = verifyAccountDto;
      let result: any;
      if (type == AuthMethod.EMAIL) {
        result = await this._findEmail(email!);
      } else {
        result = await this._findPhone(phone!);
      }

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

  private async _findEmail(email: string, throwErrorIfExist = false) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user && throwErrorIfExist) {
      throw new BadRequestException(`The email ${email} is already in use.`);
    }

    return { exist: !!user, email: email };
  }

  private async _findPhone(phone: PhoneDto, throwErrorIfExist = false) {
    try {
      const phoneProcessed = phone!.number.replaceAll(' ', '');

      //** Validar si existe el country */
      const country: Country = await this.countriesService.findOneWithExeption(
        phone.countryId,
      );

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

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private buildAuthResponse(user: User): AuthResponseDto {
    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      },
      token: this.getJwt({ id: user.id }),
    };
  }
}
