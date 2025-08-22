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
import { AuthMethod } from 'src/core/models/auth-method';
import { Country } from 'src/countries/entities/country.entity';
import { CountriesService } from 'src/countries/services/countries.service';
import { MailService } from 'src/mail/services/mail.service';
import { TwilioService } from 'src/twilio/services/twilio.service';
import { VerificationCodesService } from 'src/verification-codes/services/verification-codes.service';
import { Repository } from 'typeorm';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { PhoneRequestDto } from '../dto/phone-request.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { SendVerificationCodeResponseDto } from '../dto/send-verification-code-response.dto';
import { VerifyAccountRequestDto } from '../dto/verify-account-request.dto';
import { VerifyAccountResponseDto } from '../dto/verify-account-response.dto';
import { VerifyCodeRequestDto } from '../dto/verify-code-request.dto';
import { UserEntity } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly countriesService: CountriesService,
    private readonly twilioService: TwilioService,
    private readonly mailService: MailService,
    private readonly verificationCodesService: VerificationCodesService,
  ) {}

  async register(params: RegisterRequestDto): Promise<AuthResponseDto> {
    try {
      const { password, email, phone, type, verificationCode, ...userData } =
        params;

      //** Crear el usuario */
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const verifyAccountRes = await this.verifyAccount(params);

      if (verifyAccountRes.accountExists) {
        if (type == AuthMethod.EMAIL && email) {
          throw new BadRequestException('The email is already in use.');
        }
        if (type == AuthMethod.PHONE && phone) {
          throw new BadRequestException('The phone is already in use.');
        }
      }

      //** Aignar email o telefono */
      if (type == AuthMethod.EMAIL && email) {
        user.email = email;
      }

      if (type == AuthMethod.PHONE && phone) {
        user.phone = phone.number;
        user.phoneCountryId = phone.countryId;
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

  async login(params: LoginRequestDto): Promise<AuthResponseDto> {
    const { password, email, phone, type } = params;

    let user: UserEntity | null = null;

    // Buscar usuario por email o (phone y phoneCountry)
    if (type == AuthMethod.EMAIL && email) {
      user = await this.userRepository.findOne({
        where: { email },
      });
    }

    if (type == AuthMethod.PHONE && phone) {
      user = await this.userRepository.findOne({
        where: {
          phone: phone.number,
          phoneCountryId: phone.countryId,
        },
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

  async sendVerificationCode(
    params: VerifyAccountRequestDto,
  ): Promise<SendVerificationCodeResponseDto> {
    try {
      const { phone, type, email } = params;

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
        verificationCodeId: verificationCode.id,
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
  async verifyCode(params: VerifyCodeRequestDto) {
    try {
      await this.verificationCodesService.verify(params);

      return { message: 'Code verified successfully.' };
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(
          'Failed to check verification code.',
        );
      }
      throw error;
    }
  }

  async verifyAccount(
    params: VerifyAccountRequestDto,
  ): Promise<VerifyAccountResponseDto> {
    try {
      const { phone, type, email } = params;
      let accountExists = false;

      if (type == AuthMethod.EMAIL && email) {
        accountExists = await this.existsEmail(email!);
      }
      if (type == AuthMethod.PHONE && phone) {
        accountExists = await this.existsPhone(phone!);
      }
      return { accountExists };
    } catch (error) {
      throw new InternalServerErrorException('Failed to verify account');
    }
  }

  private async existsEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return !!user;
  }

  private async existsPhone(phone: PhoneRequestDto) {
    const phoneProcessed = phone!.number.replaceAll(' ', '');

    const country: Country = await this.countriesService.findOneWithExeption(
      phone.countryId,
    );

    const phoneExists = await this.userRepository.findOne({
      where: {
        phone: phoneProcessed,
        phoneCountryId: country.id,
      },
    });

    return !!phoneExists;
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private buildAuthResponse(user: UserEntity): AuthResponseDto {
    return {
      token: this.getJwt({ id: user.id }),
    };
  }
}
