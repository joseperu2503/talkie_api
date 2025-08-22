import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PhoneRequestDto } from 'src/auth/dto/phone-request.dto';
import { AuthMethod } from 'src/core/models/auth-method';

export class AddContactRequestDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'test1@gmail.com',
  })
  @ValidateIf((dto) => dto.type === AuthMethod.EMAIL) // Se valida solo si type es 'email'
  @IsString()
  @IsEmail()
  email: string | null;

  @ApiPropertyOptional({
    description: 'The phone of the user',
  })
  @ValidateIf((dto) => dto.type === AuthMethod.PHONE) // Se valida solo si type es 'phone'
  @ValidateNested()
  @Type(() => PhoneRequestDto)
  phone?: PhoneRequestDto;

  @ApiProperty({
    description: 'The type of authentication, either email or phone',
    enum: AuthMethod,
    example: AuthMethod.EMAIL,
  })
  @IsEnum(AuthMethod)
  type: AuthMethod;
}
