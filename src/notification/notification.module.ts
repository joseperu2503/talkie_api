import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationController } from './controllers/notification.controller';
import { FcmToken } from './entities/fcm-token.entity';
import { FirebaseService } from './services/firebase.service';
import { NotificationService } from './services/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, FirebaseService],
  imports: [TypeOrmModule.forFeature([FcmToken]), AuthModule],
  exports: [NotificationService],
})
export class NotificationsModule {}
