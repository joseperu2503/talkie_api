import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class SendMessageRequestDto {
  @IsString()
  @IsOptional()
  readonly content: string | null;

  @IsUUID()
  @IsNotEmpty()
  readonly chatId: string;

  @IsUrl()
  @IsOptional()
  readonly fileUrl: string | null;

  @IsUUID()
  @IsNotEmpty()
  readonly temporalId: string;
}
