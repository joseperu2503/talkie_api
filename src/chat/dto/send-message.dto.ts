import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsPositive()
  @IsInt()
  readonly recipientId: number;
}
