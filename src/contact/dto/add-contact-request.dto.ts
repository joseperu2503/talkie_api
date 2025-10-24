import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsString, ValidateNested } from 'class-validator';
import { PhoneRequestDto } from 'src/auth/dto/phone-request.dto';
import { AuthMethod } from 'src/core/models/auth-method';
import { IsNullableIf } from 'src/core/validators/is-nullable.validator';
import { IsPresent } from 'src/core/validators/is-present.validator';

export class AddContactRequestDto {
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
}
