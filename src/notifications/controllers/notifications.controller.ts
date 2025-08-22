import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/auth/entities/user.entity';
import { CreateFcmTokenDto } from '../dto/create-fcm-token.dto';
import { FirebaseService } from '../services/firebase.service';
import { NotificationsService } from '../services/notifications.service';

@ApiExcludeController()
@Controller('notifications')
@Auth()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/fcm-token')
  async createFcmToken(
    @Body() createFcmTokenDto: CreateFcmTokenDto,
    @GetUser() user: UserEntity,
  ) {
    return this.notificationsService.createFcmToken(createFcmTokenDto, user);
  }

  //Solo para ejemplo no se usa en el proyecto
  @Get('/fcm-access-token')
  async getAccessToken() {
    return this.firebaseService.getAccessToken();
  }
}
