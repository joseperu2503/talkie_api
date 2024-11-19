import { MessageUser } from '../entities/message-user.entity';

export class MessageResponseDto {
  id: string;

  content: string | null;

  sentAt: Date;

  fileUrl: string | null;

  sender: {
    id: number;
    name: string;
    surname: string;
    email: string;
    photo: string;
  };

  isSender: boolean;
  isImage: boolean;

  chatId: string;

  temporalId?: string | null;

  receivers: {
    delivered_at: Date | null;
    read_at: Date | null;
  }[];
}
