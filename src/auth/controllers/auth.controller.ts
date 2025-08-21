import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { VerifyAccountRequestDto } from '../dto/verify-account-request.dto';
import { VerifyCodeRequestDto } from '../dto/verify-code-request.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() request: RegisterRequestDto) {
    return this.authService.register(request);
  }

  @Post('login')
  login(@Body() request: LoginRequestDto) {
    return this.authService.login(request);
  }

  @Post('send-verification-code')
  async sendVerificationCode(@Body() request: VerifyAccountRequestDto) {
    return this.authService.sendVerificationCode(request);
  }

  @Post('verify-code')
  async verifyCode(@Body() request: VerifyCodeRequestDto) {
    return this.authService.verifyCode(request);
  }

  @Post('verify-account')
  async verifyAccount(@Body() request: VerifyAccountRequestDto) {
    return this.authService.verifyAccount(request);
  }
}
