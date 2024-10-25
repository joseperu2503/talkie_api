export class MessageResponseDto {
  id: string;

  content: string | null;

  timestamp: Date;

  sender: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };

  isSender: boolean;
  isImage: boolean;
}
