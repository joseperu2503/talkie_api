import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PhoneDto } from './phone.dto';

export class VerifyCodeDto {
  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto;

  @IsString()
  @IsNotEmpty()
  code: string;
}
