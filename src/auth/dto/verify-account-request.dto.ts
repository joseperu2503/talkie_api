import { OmitType } from '@nestjs/mapped-types';
import { LoginRequestDto } from './login-request.dto';

export class VerifyAccountRequestDto extends OmitType(LoginRequestDto, [
  'password',
] as const) {}
