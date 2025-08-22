import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsString, ValidateNested } from 'class-validator';
import { AuthMethod } from 'src/core/models/auth-method';
import { IsNullableIf } from 'src/core/validators/is-nullable.validator';
import { IsPresent } from 'src/core/validators/is-present.validator';
import { PhoneRequestDto } from './phone-request.dto';

export class LoginRequestDto {
  @ApiProperty({
    description: 'The email address of the user',
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
    description: 'The phone of the user',
    type: PhoneRequestDto,

    nullable: true,
  })
  @IsPresent()
  @IsNullableIf((dto) => dto.type === AuthMethod.EMAIL)
  @ValidateNested()
  @Type(() => PhoneRequestDto)
  phone: PhoneRequestDto | null;

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
