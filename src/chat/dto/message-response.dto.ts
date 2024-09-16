export class MessageResponseDto {
  id: number;

  content: string;

  timestamp: Date;

  sender: {
    id: number;
    name: string;
  };

  isSender: boolean;
}
