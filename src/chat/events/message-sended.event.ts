import { Message } from '../entities/message.entity';
import { Chat } from '../entities/chat.entity';

export class MessageSendedEvent {
  message: Message;
  chat: Chat;
}
