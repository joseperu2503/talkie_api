import { MessageResponseDto } from '../dto/message-response.dto';
import { Message } from '../entities/message.entity';

export class MessageResource {
  readonly message: Message;
  readonly userId: number;
  readonly temporalId?: string;

  constructor(message: Message, userId: number, temporalId?: string) {
    this.message = message;
    this.userId = userId;
    this.temporalId = temporalId;
  }

  get response(): MessageResponseDto {
    const { id, content, timestamp, sender, fileUrl, chat } = this.message;

    return {
      id,
      content,
      timestamp,
      fileUrl,
      isSender: sender.id === this.userId,
      isImage: isImageUrl(fileUrl),
      sender: {
        id: sender.id,
        name: sender.name,
        surname: sender.surname,
        email: sender.email,
        photo: sender.photo,
      },
      chatId: chat.id,
      temporalId: this.temporalId,
      statusId: 2,
    };
  }
}

export function isImageUrl(url: string | null): boolean {
  try {
    if (!url) return false;

    const parsedUrl = new URL(url);
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|tif)$/i;
    return imageExtensions.test(parsedUrl.pathname);
  } catch (error) {
    return false; // Si la URL no es válida, devuelve false
  }
}
