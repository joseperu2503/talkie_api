import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFcmTokenDto } from '../dto/create-fcm-token.dto';
import { FcmToken } from '../entities/fcm-token.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(FcmToken)
    private fcmTokenRepository: Repository<FcmToken>,
  ) {}

  async createFcmToken(createFcmTokenDto: CreateFcmTokenDto, user: User) {
    // Verificar si el token ya existe
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

  async sendMessage(payload: {
    users: User[];
    body: string;
    title: string;
    data?: { [key: string]: string };
  }) {
    const { users, body, title, data } = payload;

    for (const user of users) {
      const tokens = user.fcmTokens;

      for (const fcmToken of tokens) {
        const message: Message = {
          token: fcmToken.token,
          notification: {
            title: title,
            body,
          },
          data,
          webpush: {
            fcmOptions: {
              link: '/',
            },
            notification: {
              title,
              body,
            },
          },
        };

        try {
          const response = await admin.messaging().send(message);
          // console.log('notificacion enviada', fcmToken);
        } catch (error) {
          // console.log('notificacion fallida', fcmToken);
        }
      }
    }
  }
}
