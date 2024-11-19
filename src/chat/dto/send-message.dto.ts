import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsUUID()
  @IsNotEmpty()
  readonly chatId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly temporalId: string;
}
