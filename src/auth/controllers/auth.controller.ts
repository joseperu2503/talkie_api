import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user-dto';
import { VerifyAccountDto } from '../dto/verify-account.dto';
import { VerificationcodeDto } from '../dto/verification-code.dto';

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

  @Post('send-verification-code')
  async sendVerificationCode(@Body() body: VerifyAccountDto) {
    return this.authService.sendVerificationCode(body);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: VerificationcodeDto) {
    return this.authService.verifyCode(body);
  }

  @Post('verify-account')
  async verifyAccount(@Body() body: VerifyAccountDto) {
    return this.authService.verifyAccount(body);
  }
}
