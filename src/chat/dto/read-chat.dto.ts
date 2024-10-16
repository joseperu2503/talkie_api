import { IsNotEmpty, IsString } from 'class-validator';

export class ReadChatDto {
  @IsString()
  @IsNotEmpty()
  readonly chatId: string;
}
