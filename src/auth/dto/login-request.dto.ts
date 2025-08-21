import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PhoneDto } from './phone.dto';

export enum AuthMethod {
  EMAIL = 'email',
  PHONE = 'phone',
}

export class LoginRequest {
  @ValidateIf((dto) => dto.type === AuthMethod.EMAIL) // Se valida solo si type es 'email'
  @IsString()
  @IsEmail()
  email?: string; // Obligatorio si type es 'email'

  @ValidateIf((dto) => dto.type === AuthMethod.PHONE) // Se valida solo si type es 'phone'
  @ValidateNested()
  @Type(() => PhoneDto)
  phone?: PhoneDto;

  @IsString()
  password: string; // Siempre obligatorio

  @IsEnum(AuthMethod)
  type: AuthMethod;
}
