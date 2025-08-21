import { OmitType } from '@nestjs/mapped-types';
import { LoginRequest } from './login-request.dto';

export class VerifyAccountDto extends OmitType(LoginRequest, [
  'password',
] as const) {}
