import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeResponseDto {
  @ApiProperty({
    example: 'Code verified successfully.',
  })
  message: string;
}
