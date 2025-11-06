import { ApiProperty } from '@nestjs/swagger';

export class CheckAccountResponseDto {
  @ApiProperty({
    example: true,
  })
  accountExists: boolean;
}
