import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class PhoneRequestDto {
  @ApiProperty({
    example: 1,
  })
  @IsPositive()
  @IsNumber()
  countryId: number;

  @ApiProperty({
    example: '34567890',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\s+/g, ''))
  number: string;
}
