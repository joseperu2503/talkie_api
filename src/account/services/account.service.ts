import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Country } from 'src/country/entities/country.entity';
import { CountryService } from 'src/country/services/country.service';
import { Not, Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly countryService: CountryService,
  ) {}

  async profile(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        phoneCountry: true,
      },
    });

    const { id, name, email, surname, phone, phoneCountry, photo } = user!;

    return {
      id,
      email,
      name,
      surname,
      phone:
        phone && phoneCountry
          ? {
              number: phone,
              country: phoneCountry,
            }
          : null,
      photo,
    };
  }

  async updateProfile(user: User, updateAuthDto: UpdateProfileRequestDto) {
    try {
      const { email, phone, password, ...otherUpdates } = updateAuthDto;

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
        const country: Country = await this.countryService.findOneWithExeption(
          phone!.countryId,
        );

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
}
