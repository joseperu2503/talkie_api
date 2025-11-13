import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpResponseDto {
  @ApiProperty({
    example: 'OTP verified successfully.',
  })
  message: string;
}
