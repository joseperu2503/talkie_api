import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccountResponseDto {
  @ApiProperty({
    description: 'Whether the account exists',
    example: true,
  })
  accountExists: boolean;
}
