import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsString()
  @IsNotEmpty()
  readonly temporalMessageId: string;

  @IsString()
  @IsNotEmpty()
  readonly chatId: string;
}
