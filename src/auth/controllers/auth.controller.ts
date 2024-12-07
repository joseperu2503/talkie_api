import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user-dto';

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

  // Endpoint para enviar SMS con código de verificación
  @Post('send-verification-code')
  async sendVerificationCode(@Body() body: { phoneNumber: string }) {
    const { phoneNumber } = body;

    // Enviar el código de verificación a través de Twilio
    return this.authService.sendVerificationCode(phoneNumber);
  }

  // Endpoint para verificar el código ingresado
  @Post('verify-code')
  async verifyCode(@Body() body: { phoneNumber: string; code: string }) {
    const { phoneNumber, code } = body;

    return this.authService.checkVerificationCode(phoneNumber, code);
  }
}
