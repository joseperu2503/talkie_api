import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class VerificationcodeDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @Length(4, 4)
  code: string;
}
