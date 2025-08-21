import { Body, Controller, Get, Put } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('user')
@Auth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  updateProfile(@GetUser() user: User, @Body() updateAuthDto: UpdateAuthDto) {
    return this.usersService.updateProfile(user, updateAuthDto);
  }

  @Get('profile')
  profile(@GetUser() user: User) {
    return this.usersService.profile(user.id);
  }
}
