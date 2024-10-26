import { Injectable } from '@nestjs/common';
import { CreateFcmTokenDto } from '../dto/create-fcm-token.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmToken } from '../entities/fcm-token';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(FcmToken)
    private fcmTokenRepository: Repository<FcmToken>,
  ) {}

  async createFcmToken(createFcmTokenDto: CreateFcmTokenDto, user: User) {
    // Verificar si el token ya existe para el usuario
    const existingToken = await this.fcmTokenRepository.findOne({
      where: { token: createFcmTokenDto.fcmToken },
    });

    if (existingToken) {
      // Si el token existe, actualizamos el usuario asociado
      existingToken.user = user;
      return this.fcmTokenRepository.save(existingToken);
    } else {
      // Si no existe, creamos un nuevo registro
      const fcmToken = this.fcmTokenRepository.create({
        token: createFcmTokenDto.fcmToken,
        user,
      });
      return this.fcmTokenRepository.save(fcmToken);
    }
  }
}
