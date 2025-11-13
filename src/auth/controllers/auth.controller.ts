import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthMethod } from 'src/core/models/auth-method';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { CheckAccountRequestDto } from '../dto/check-account-request.dto';
import { CheckAccountResponseDto } from '../dto/check-account-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { SendOtpRequestDto } from '../dto/send-otp-request.dto';
import { SendOtpResponseDto } from '../dto/send-otp-response.dto';
import { VerifyOtpRequestDto } from '../dto/verify-otp-request.dto';
import { VerifyOtpResponseDto } from '../dto/verify-otp-response.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: RegisterRequestDto,
    examples: {
      emailExample: {
        summary: 'Register with email',
        value: {
          type: AuthMethod.EMAIL,
          name: 'John Doe',
          surname: 'Doe',
          email: 'test1@gmail.com',
          phone: null,
          password: 'Abc123',
          verificationCode: {
            id: '61b7ac6b-2f07-42be-8416-443aafcebf23',
            code: '1234',
          },
        },
      },
      phoneExample: {
        summary: 'Register with phone',
        value: {
          type: AuthMethod.PHONE,
          name: 'John Doe',
          surname: 'Doe',
          email: null,
          phone: {
            number: '+1234567890',
            countryId: 1,
          },
          password: 'Abc123',
          verificationCode: {
            id: '61b7ac6b-2f07-42be-8416-443aafcebf23',
            code: '1234',
          },
        },
      },
    },
  })
  @ApiResponse({
    type: AuthResponseDto,
    status: 200,
  })
  @Post('register')
  register(@Body() request: RegisterRequestDto) {
    return this.authService.register(request);
  }

  @ApiOperation({ summary: 'Login with email or phone' })
  @ApiBody({
    type: LoginRequestDto,
    examples: {
      emailExample: {
        summary: 'Login with email',
        value: {
          type: AuthMethod.EMAIL,
          email: 'test1@gmail.com',
          phone: null,
          password: 'Abc123',
        },
      },
      phoneExample: {
        summary: 'Login with phone',
        value: {
          type: AuthMethod.PHONE,
          email: null,
          phone: {
            number: '+1234567890',
            countryId: 1,
          },
          password: 'Abc123',
        },
      },
    },
  })
  @ApiResponse({
    type: AuthResponseDto,
    status: 200,
  })
  @Post('login')
  login(@Body() request: LoginRequestDto) {
    return this.authService.login(request);
  }

  @ApiOperation({ summary: 'Send otp' })
  @ApiBody({
    type: SendOtpRequestDto,
    examples: {
      emailExample: {
        summary: 'Send otp with email',
        value: {
          type: AuthMethod.EMAIL,
          email: 'test1@gmail.com',
          phone: null,
        },
      },
      phoneExample: {
        summary: 'Send otp with phone',
        value: {
          type: AuthMethod.PHONE,
          email: null,
          phone: {
            number: '+1234567890',
            countryId: 1,
          },
        },
      },
    },
  })
  @ApiResponse({
    type: SendOtpResponseDto,
    status: 200,
  })
  @HttpCode(200)
  @Post('send-otp')
  async sendOtp(@Body() request: CheckAccountRequestDto) {
    return this.authService.sendOtp(request);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @ApiBody({
    type: VerifyOtpRequestDto,
  })
  @ApiResponse({
    type: VerifyOtpResponseDto,
    status: 200,
  })
  @HttpCode(200)
  @Post('verify-otp')
  async verifyOtp(@Body() request: VerifyOtpRequestDto) {
    return this.authService.verifyOtp(request);
  }

  @ApiOperation({ summary: 'Check if the account exists' })
  @ApiBody({
    type: CheckAccountRequestDto,
    examples: {
      emailExample: {
        summary: 'Check account with email',
        value: {
          type: AuthMethod.EMAIL,
          email: 'test1@gmail.com',
          phone: null,
        },
      },
      phoneExample: {
        summary: 'Check account with phone',
        value: {
          type: AuthMethod.PHONE,
          email: null,
          phone: {
            number: '+1234567890',
            countryId: 1,
          },
        },
      },
    },
  })
  @ApiResponse({
    type: CheckAccountResponseDto,
    status: 200,
    example: { accountExists: true },
  })
  @HttpCode(200)
  @Post('check-account')
  async checkAccount(@Body() request: CheckAccountRequestDto) {
    return this.authService.verifyAccount(request);
  }
}
