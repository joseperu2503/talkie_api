import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthMethod } from 'src/core/models/auth-method';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { CheckAccountRequestDto } from '../dto/check-account-request.dto';
import { CheckAccountResponseDto } from '../dto/check-account-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { SendVerificationCodeRequestDto } from '../dto/send-verification-code-request.dto';
import { SendVerificationCodeResponseDto } from '../dto/send-verification-code-response.dto';
import { VerifyCodeRequestDto } from '../dto/verify-code-request.dto';
import { VerifyCodeResponseDto } from '../dto/verify-code-response.dto';
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

  @ApiOperation({ summary: 'Send verification code' })
  @ApiBody({
    type: SendVerificationCodeRequestDto,
    examples: {
      emailExample: {
        summary: 'Send verification code with email',
        value: {
          type: AuthMethod.EMAIL,
          email: 'test1@gmail.com',
          phone: null,
        },
      },
      phoneExample: {
        summary: 'Send verification code with phone',
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
    type: SendVerificationCodeResponseDto,
    status: 200,
  })
  @HttpCode(200)
  @Post('send-verification-code')
  async sendVerificationCode(@Body() request: CheckAccountRequestDto) {
    return this.authService.sendVerificationCode(request);
  }

  @ApiOperation({ summary: 'Verify verification code' })
  @ApiBody({
    type: VerifyCodeRequestDto,
  })
  @ApiResponse({
    type: VerifyCodeResponseDto,
    status: 200,
  })
  @HttpCode(200)
  @Post('verify-code')
  async verifyCode(@Body() request: VerifyCodeRequestDto) {
    return this.authService.verifyCode(request);
  }

  @ApiOperation({ summary: 'Verify if the account exists' })
  @ApiBody({
    type: CheckAccountRequestDto,
    examples: {
      emailExample: {
        summary: 'Verify account with email',
        value: {
          type: AuthMethod.EMAIL,
          email: 'test1@gmail.com',
          phone: null,
        },
      },
      phoneExample: {
        summary: 'Verify account with phone',
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
