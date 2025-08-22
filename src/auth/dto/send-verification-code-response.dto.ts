import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationCodeResponseDto {
  @ApiProperty({
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
  })
  verificationCodeId: string;
}
