import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationCodeResponseDto {
  @ApiProperty({
    description: 'The verification code id',
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
  })
  verificationCodeId: string;
}
