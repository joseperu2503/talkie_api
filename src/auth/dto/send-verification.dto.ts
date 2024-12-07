import { IsPhoneNumber } from 'class-validator';

export class SendVerificationDTO {
  @IsPhoneNumber()
  phoneNumber: string;
}
