import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PhoneRequestDto } from './phone-request.dto';

export enum AuthMethod {
  EMAIL = 'email',
  PHONE = 'phone',
}

export class LoginRequestDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'test1@gmail.com',
  })
  @ValidateIf((dto) => dto.type === AuthMethod.EMAIL) // Se valida solo si type es 'email'
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The phone of the user',
  })
  @ValidateIf((dto) => dto.type === AuthMethod.PHONE) // Se valida solo si type es 'phone'
  @ValidateNested()
  @Type(() => PhoneRequestDto)
  phone?: PhoneRequestDto;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Abc123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The type of authentication, either email or phone',
    enum: AuthMethod,
    example: AuthMethod.EMAIL,
  })
  @IsEnum(AuthMethod)
  type: AuthMethod;
}
