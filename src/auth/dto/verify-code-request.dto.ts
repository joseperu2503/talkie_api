import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class VerifyCodeRequestDto {
  @ApiProperty({
    description: 'The verification code id',
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The verification code',
    example: '1234',
  })
  @IsString()
  @Length(4, 4)
  code: string;
}
