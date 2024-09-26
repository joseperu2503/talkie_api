export class MessageResponseDto {
  id: string;

  content: string;

  timestamp: Date;

  sender: {
    id: number;
    name: string;
  };

  isSender: boolean;
}
