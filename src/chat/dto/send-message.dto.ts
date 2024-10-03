import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsPositive()
  @IsInt()
  readonly receiverId: number;

  @IsString()
  @IsOptional()
  readonly temporalChatId?: string;
}
