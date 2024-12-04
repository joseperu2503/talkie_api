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
import { LoginUserDto } from '../dto/login-user-dto';
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { UpdateUserStatusDto } from 'src/chat/dto/update-user-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactUpdatedEvent } from 'src/chat/events/contact-updated.event';
import { Country } from 'src/countries/entities/country.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private eventEmitter: EventEmitter2,
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
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    //si el usuario con el email no existe
    if (!user) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }

    //si la contraseña es incorrecta
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(`Credentials are not valid`);
    }
    const me = await this.usersService.profile(user.id);
    return { user: me, token: this.getJwt({ id: user.id }) };
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
