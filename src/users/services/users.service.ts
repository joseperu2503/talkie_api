import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserStatusDto } from 'src/chat/dto/update-user-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactUpdatedEvent } from 'src/chat/events/contact-updated.event';
import { Country } from 'src/countries/entities/country.entity';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private eventEmitter: EventEmitter2,
  ) {}

  async profile(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        phoneCountry: true,
      },
    });

    const { id, name, email, surname, phone, phoneCountry, username, photo } =
      user!;

    return {
      id,
      email,
      name,
      surname,
      phone: {
        number: phone,
        country: phoneCountry,
      },
      username,
      photo,
    };
  }

  async updateProfile(user: User, updateAuthDto: UpdateAuthDto) {
    try {
      const { email, phone, username, password, ...otherUpdates } =
        updateAuthDto;

      // Validar email duplicado
      if (email) {
        const emailExists = await this.userRepository.findOne({
          where: { email, id: Not(user.id) },
        });
        if (emailExists) {
          throw new BadRequestException('Email is already in use.');
        }

        user.email = email;
      }

      // Validar combinación de phone y phoneCountry duplicada
      if (phone) {
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
        const phoneCombinationExists = await this.userRepository.findOne({
          where: {
            phone: phone.number,
            phoneCountry: { id: phone.countryId },
            id: Not(user.id), // Excluir al usuario actual
          },
          relations: ['phoneCountry'], // Asegúrate de incluir la relación
        });
        if (phoneCombinationExists) {
          throw new BadRequestException(
            'Phone and country combination is already in use.',
          );
        }

        user.phone = phone.number;
        user.phoneCountry = country;
      }

      // Validar username duplicado
      if (username) {
        const usernameExists = await this.userRepository.findOne({
          where: { username, id: Not(user.id) },
        });
        if (usernameExists) {
          throw new BadRequestException('Username is already in use.');
        }

        user.username = username;
      }

      // Encriptar la nueva contraseña si se envía
      if (password) {
        user.password = bcrypt.hashSync(password, 10);
      }

      // Aplicar actualizaciones
      this.userRepository.merge(user, {
        ...otherUpdates,
      });

      await this.userRepository.save(user);

      // Retornar el usuario actualizado
      return await this.profile(user.id);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException(error.message);
      }
      throw error;
    }
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
