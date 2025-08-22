import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccountResponseDto {
  @ApiProperty({
    example: true,
  })
  accountExists: boolean;
}
