import { Body, Controller, Get, Put } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateProfileRequestDto } from 'src/users/dto/update-profile-request.dto';
import { UserEntity } from '../../auth/entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('user')
@Auth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  updateProfile(@GetUser() user: UserEntity, @Body() request: UpdateProfileRequestDto) {
    return this.usersService.updateProfile(user, request);
  }

  @Get('profile')
  profile(@GetUser() user: UserEntity) {
    return this.usersService.profile(user.id);
  }
}
