import { OmitType } from '@nestjs/mapped-types';
import { LoginUserDto } from './login-user-dto';

export class VerifyAccountDto extends OmitType(LoginUserDto, [
  'password',
] as const) {}
