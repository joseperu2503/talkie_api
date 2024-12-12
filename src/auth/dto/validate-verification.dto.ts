import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class ValidateVerificationDTO {
  @IsString()
  @Length(6, 6) // El código tiene que ser de exactamente 6 caracteres
  verificationCode: string;

  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
