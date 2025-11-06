import { OmitType } from '@nestjs/swagger';
import { LoginRequestDto } from './login-request.dto';

export class CheckAccountRequestDto extends OmitType(LoginRequestDto, [
  'password',
] as const) {}
