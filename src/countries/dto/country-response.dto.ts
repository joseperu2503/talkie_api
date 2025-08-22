import { ApiProperty } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the country' })
  id: number;

  @ApiProperty({ example: 'Afghanistan', description: 'Country name' })
  name: string;

  @ApiProperty({ example: '🇦🇫', description: 'Emoji flag of the country' })
  flag: string;

  @ApiProperty({ example: 'AF', description: 'ISO country code' })
  code: string;

  @ApiProperty({ example: '+93', description: 'Dialing code of the country' })
  dialCode: string;

  @ApiProperty({
    example: '999 999 9999',
    description: 'Phone number mask for the country',
  })
  mask: string;
}
