import { IsNotEmpty, IsString } from 'class-validator';

export class ReadChatRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly chatId: string;
}
