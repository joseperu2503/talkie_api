import { OmitType } from '@nestjs/swagger';
import { LoginRequestDto } from './login-request.dto';

export class VerifyAccountRequestDto extends OmitType(LoginRequestDto, [
  'password',
] as const) {}
