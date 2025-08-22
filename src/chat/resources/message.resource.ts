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
    const { id, content, sentAt, sender, fileUrl, chat } = this.message;

    return {
      id,
      content,
      sentAt,
      fileUrl,
      isSender: sender.id === this.userId,
      sender: {
        id: sender.id,
        name: sender.name,
        surname: sender.surname,
        email: sender.email,
        photo: sender.photo,
      },
      chatId: chat.id,
      temporalId: this.temporalId,
      receivers: this.message.messageUsers.map((messageUser) => {
        const { deliveredAt, readAt } = messageUser;
        return { id: messageUser.userId, deliveredAt, readAt };
      }),
    };
  }
}
