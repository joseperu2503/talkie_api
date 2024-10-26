import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmToken } from './entities/fcm-token';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [TypeOrmModule.forFeature([FcmToken]), AuthModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
