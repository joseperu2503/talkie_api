import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { JwtAuth } from './decorators/jwt-auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Put('update')
  @JwtAuth()
  update(@GetUser() user: User, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(user, updateAuthDto);
  }

  @Get('me')
  @JwtAuth()
  me(@GetUser() user: User) {
    return this.authService.me(user);
  }
}
