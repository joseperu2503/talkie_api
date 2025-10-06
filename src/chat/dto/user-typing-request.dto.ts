import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserTypingRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly chatId: string;

  @IsBoolean()
  readonly isTyping: boolean;
}
