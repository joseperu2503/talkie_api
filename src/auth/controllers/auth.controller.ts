import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest } from '../dto/login-request.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { VerificationcodeDto } from '../dto/verification-code.dto';
import { VerifyAccountDto } from '../dto/verify-account.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterRequestDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginRequest) {
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
