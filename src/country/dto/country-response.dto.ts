import { ApiProperty } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Afghanistan' })
  name: string;

  @ApiProperty({ example: '🇦🇫' })
  flag: string;

  @ApiProperty({ example: 'AF' })
  code: string;

  @ApiProperty({ example: '+93' })
  dialCode: string;

  @ApiProperty({
    example: '999 999 9999',
  })
  mask: string;
}
