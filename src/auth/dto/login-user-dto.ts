import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsInt,
  IsIn,
  ValidateIf,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { PhoneDto } from './phone.dto';

export enum LoginType {
  EMAIL = 'email',
  PHONE = 'phone',
}

export class LoginUserDto {
  @ValidateIf((dto) => dto.type === LoginType.EMAIL) // Se valida solo si type es 'email'
  @IsString()
  @IsEmail(
    {},
    { message: 'A valid email address is required when type is "email".' },
  )
  email?: string; // Obligatorio si type es 'email'

  @ValidateIf((dto) => dto.type === LoginType.PHONE) // Se valida solo si type es 'phone'
  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto;

  @IsString()
  password: string; // Siempre obligatorio

  @IsEnum(LoginType)
  type: LoginType;
}
