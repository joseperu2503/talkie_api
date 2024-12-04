import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsPositive()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly flag: string;

  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  readonly dialCode: string;

  @IsString()
  @IsNotEmpty()
  readonly mask: string;
}
