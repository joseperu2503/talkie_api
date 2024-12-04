import { Controller, Put, Body, Get } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('user')
@JwtAuth()
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
