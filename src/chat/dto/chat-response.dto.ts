import { ApiProperty } from '@nestjs/swagger';
import { ContactResponseDto } from 'src/contact/dto/contact-response.dto';
import { MessageResponseDto } from './message-response.dto';

export class ChatResponseDto {
  @ApiProperty({
    example: '0b724adb-5e9e-4de4-920a-b911fe2dc4b9',
  })
  id: string;

  @ApiProperty({
    nullable: true,
    type: MessageResponseDto,
  })
  lastMessage: MessageResponseDto | null;

  @ApiProperty({
    type: ContactResponseDto,
    isArray: true,
  })
  members: ContactResponseDto[];

  @ApiProperty({
    example: 0,
  })
  unreadMessagesCount: number;
}
