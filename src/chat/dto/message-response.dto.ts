export class MessageResponseDto {
  id: string;

  content: string;

  timestamp: Date;

  sender: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };

  isSender: boolean;
}
