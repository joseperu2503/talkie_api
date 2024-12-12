import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { CreateFcmTokenDto } from '../dto/create-fcm-token.dto';
import { User } from 'src/users/entities/user.entity';
import { FirebaseService } from '../services/firebase.service';

@Controller('notifications')
@JwtAuth()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/fcm-token')
  async createFcmToken(
    @Body() createFcmTokenDto: CreateFcmTokenDto,
    @GetUser() user: User,
  ) {
    return this.notificationsService.createFcmToken(createFcmTokenDto, user);
  }

  //Solo para ejemplo no se usa en el proyecto
  @Get('/fcm-access-token')
  async getAccessToken() {
    return this.firebaseService.getAccessToken();
  }
}
