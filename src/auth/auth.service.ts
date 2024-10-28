import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UpdateUserStatusDto } from 'src/chat/dto/update-user-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactUpdatedEvent } from 'src/chat/events/contact-updated.event';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      const { password, ...userData } = registerUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      const me = this.me(user);
      return { user: me, token: this.getJwt({ id: user.id }) };
    } catch (error) {
      throw new InternalServerErrorException(error);
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
    const me = this.me(user);
    return { user: me, token: this.getJwt({ id: user.id }) };
  }

  me(user: User) {
    const { id, email, name, surname, phone } = user;

    return {
      id,
      email,
      name,
      surname,
      phone,
    };
  }

  async update(user: User, UpdateAuthDto: UpdateAuthDto) {
    this.userRepository.merge(user, UpdateAuthDto);

    await this.userRepository.save(user);
    return this.me(user);
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findOne(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async updateStatus(user: User, updateUserStatusDto: UpdateUserStatusDto) {
    // Actualizar el estado de conexión del usuario
    user.isConnected = updateUserStatusDto.isConnected;
    if (!updateUserStatusDto.isConnected) {
      user.lastConnection = new Date();
    }
    await this.userRepository.save(user);

    const contacts = await this.getContacts(user.id);
    if (!contacts) return;

    const contactUpdatedEvent = new ContactUpdatedEvent();
    contactUpdatedEvent.contacts = contacts;
    contactUpdatedEvent.user = user;

    this.eventEmitter.emit('contact.updated', contactUpdatedEvent);
  }

  async getContacts(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        initiatedContacts: {
          chat: true,
          targetContact: true,
        },
      },
    });

    return user?.initiatedContacts;
  }
}
