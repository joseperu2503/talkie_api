import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AuthMethod } from 'src/auth/dto/login-request.dto';
import { PhoneRequestDto } from 'src/auth/dto/phone-request.dto';

export class AddContactDto {
  @ValidateIf((dto) => dto.type === AuthMethod.EMAIL) // Se valida solo si type es 'email'
  @IsString()
  @IsEmail()
  email?: string; // Obligatorio si type es 'email'

  @ValidateIf((dto) => dto.type === AuthMethod.PHONE) // Se valida solo si type es 'phone'
  @ValidateNested()
  @Type(() => PhoneRequestDto)
  phone?: PhoneRequestDto;

  @IsEnum(AuthMethod)
  type: AuthMethod;
}
