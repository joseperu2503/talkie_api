import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class PhoneDto {
  @IsPositive()
  @IsNumber()
  countryId: number;

  @IsString()
  @IsNotEmpty()
  number: string;
}
