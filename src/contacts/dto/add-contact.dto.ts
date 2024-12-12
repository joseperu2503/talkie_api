import { Type } from 'class-transformer';
import {
  IsString,
  ValidateIf,
  IsEmail,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { AuthMethod } from 'src/auth/dto/login-user-dto';
import { PhoneDto } from 'src/auth/dto/phone.dto';

export class AddContactDto {
  @ValidateIf((dto) => dto.type === AuthMethod.EMAIL) // Se valida solo si type es 'email'
  @IsString()
  @IsEmail()
  email?: string; // Obligatorio si type es 'email'

  @ValidateIf((dto) => dto.type === AuthMethod.PHONE) // Se valida solo si type es 'phone'
  @ValidateNested()
  @Type(() => PhoneDto)
  phone?: PhoneDto;

  @IsEnum(AuthMethod)
  type: AuthMethod;
}
