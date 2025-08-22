import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsString, ValidateNested } from 'class-validator';
import { AuthMethod } from 'src/core/models/auth-method';
import { IsNullableIf } from 'src/core/validators/is-nullable.validator';
import { IsPresent } from 'src/core/validators/is-present.validator';
import { PhoneRequestDto } from './phone-request.dto';

export class LoginRequestDto {
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
    example: 'Abc123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    enum: AuthMethod,
    example: AuthMethod.EMAIL,
  })
  @IsEnum(AuthMethod)
  type: AuthMethod;
}
