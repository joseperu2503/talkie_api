import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateProfileRequestDto } from 'src/user/dto/update-profile-request.dto';
import { User } from '../../auth/entities/user.entity';
import { UserService } from '../services/user.service';

@ApiExcludeController()
@Controller('user')
@Auth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('profile')
  updateProfile(
    @GetUser() user: User,
    @Body() request: UpdateProfileRequestDto,
  ) {
    return this.userService.updateProfile(user, request);
  }

  @Get('profile')
  profile(@GetUser() user: User) {
    return this.userService.profile(user.id);
  }
}
