import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class PhoneDto {
  @IsPositive()
  @IsNumber()
  countryId: number;

  @IsString()
  @IsNotEmpty()
  number: string;
}

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsUrl()
  photo?: string;
}
