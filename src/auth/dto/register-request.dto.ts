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
  ValidateNested,
} from 'class-validator';
import { AuthMethod } from 'src/core/models/auth-method';
import { IsNullableIf } from 'src/core/validators/is-nullable.validator';
import { IsPresent } from 'src/core/validators/is-present.validator';
import { PhoneRequestDto } from './phone-request.dto';
import { VerifyCodeRequestDto } from './verify-code-request.dto';

export class RegisterRequestDto {
  @ApiProperty({
    type: String,
    example: 'test1@gmail.com',
    nullable: true,
  })
  @IsString()
  @IsPresent()
  @IsNullableIf((dto) => dto.type === AuthMethod.PHONE)
  @IsEmail()
  email: string | null;

  @ApiProperty({
    type: PhoneRequestDto,

    nullable: true,
  })
  @IsPresent()
  @IsNullableIf((dto) => dto.type === AuthMethod.EMAIL)
  @ValidateNested()
  @Type(() => PhoneRequestDto)
  phone: PhoneRequestDto | null;

  @ApiProperty({
    enum: AuthMethod,
    example: AuthMethod.EMAIL,
  })
  @IsEnum(AuthMethod)
  type: AuthMethod;

  @ApiProperty({
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
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsOptional()
  @IsUrl()
  photo?: string;

  @ApiProperty({
    example: '123456',
  })
  @ValidateNested()
  @Type(() => VerifyCodeRequestDto)
  @IsOptional()
  verificationCode?: VerifyCodeRequestDto;
}
