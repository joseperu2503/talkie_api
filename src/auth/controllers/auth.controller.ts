import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user-dto';
import { PhoneDto } from '../dto/phone.dto';
import { VerifyCodeDto } from '../dto/verify-code.dto';

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
  async sendVerificationCode(@Body() body: PhoneDto) {
    // Enviar el código de verificación a través de Twilio
    return this.authService.sendVerificationCode(body);
  }

  // Endpoint para verificar el código ingresado
  @Post('verify-code')
  async verifyCode(@Body() body: VerifyCodeDto) {
    return this.authService.verifyCode(body);
  }

  @Post('verify-phone')
  async verifyPhone(@Body() body: PhoneDto) {
    return this.authService.verifyPhone(body);
  }
}
