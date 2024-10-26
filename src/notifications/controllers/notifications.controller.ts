import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { CreateFcmTokenDto } from '../dto/create-fcm-token.dto';
import { User } from 'src/auth/entities/user.entity';

@Controller('notifications')
@JwtAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('/fcm-token')
  async createFcmToken(
    @Body() createFcmTokenDto: CreateFcmTokenDto,
    @GetUser() user: User,
  ) {
    return this.notificationsService.createFcmToken(createFcmTokenDto, user);
  }
}
