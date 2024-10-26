import { Injectable } from '@nestjs/common';
import { CreateFcmTokenDto } from '../dto/create-fcm-token.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmToken } from '../entities/fcm-token';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../firebase-admin.json';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(FcmToken)
    private fcmTokenRepository: Repository<FcmToken>,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

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
        };

        try {
          const response = await admin.messaging().send(message);
          return response;
        } catch (error) {}
      }
    }
  }
}
