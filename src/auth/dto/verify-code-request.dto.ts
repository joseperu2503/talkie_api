import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class VerifyCodeRequestDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @Length(4, 4)
  code: string;
}
