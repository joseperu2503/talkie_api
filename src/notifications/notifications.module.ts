import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmToken } from './entities/fcm-token.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FirebaseService } from './services/firebase.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, FirebaseService],
  imports: [TypeOrmModule.forFeature([FcmToken]), AuthModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
