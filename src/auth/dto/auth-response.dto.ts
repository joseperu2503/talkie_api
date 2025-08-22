import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU1ODQwMzQ1LCJleHAiOjE3NTg0MzIzNDV9.xA6Vl2_e_Wpu2cUFYKsyTjd_fQ9Hl0RJB3QxgI9mbrA',
  })
  token: string;
}
