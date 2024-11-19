export class MessageResponseDto {
  id: string;

  content: string | null;

  timestamp: Date;

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

  statusId: number;
}
