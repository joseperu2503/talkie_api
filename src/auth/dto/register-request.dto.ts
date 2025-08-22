import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AuthMethod } from './login-request.dto';
import { PhoneRequestDto } from './phone-request.dto';
import { VerifyCodeRequestDto } from './verify-code-request.dto';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
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
    description: 'The type of authentication, either email or phone',
    enum: AuthMethod,
    example: AuthMethod.EMAIL,
  })
  @IsEnum(AuthMethod)
  type: AuthMethod;

  @ApiProperty({
    description:
      'The password of the user, The password must have a Uppercase, lowercase letter and a number',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The surname of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsOptional()
  @IsUrl()
  photo?: string;

  @ApiProperty({
    description: 'The verification code for the user',
    example: '123456',
  })
  @ValidateNested()
  @Type(() => VerifyCodeRequestDto)
  @IsOptional()
  verificationCode?: VerifyCodeRequestDto;
}
