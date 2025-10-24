import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFcmTokenDto {
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
