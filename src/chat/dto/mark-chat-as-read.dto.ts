import { IsNotEmpty, IsString } from 'class-validator';

export class MarkChatAsReadDto {
  @IsString()
  @IsNotEmpty()
  readonly chatId: string;
}
