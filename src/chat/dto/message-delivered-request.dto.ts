import { IsNotEmpty, IsUUID } from 'class-validator';

export class MessageDeliveredRequestDto {
  @IsUUID()
  @IsNotEmpty()
  readonly messageId: string;
}
