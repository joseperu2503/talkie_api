import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

export class SendMessageRequestDto {
  @IsString()
  @IsOptional()
  readonly content: string | null;

  @IsUUID()
  @IsNotEmpty()
  readonly chatId: string;

  @IsUUID()
  @IsOptional()
  readonly fileId: string | null;

  @IsUUID()
  @IsNotEmpty()
  readonly temporalId: string;
}
