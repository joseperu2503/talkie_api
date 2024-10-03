import { User } from 'src/auth/entities/user.entity';
import { Message } from '../entities/message.entity';

export class MessageSendedEvent {
  message: Message;
  usersId: number[];
}
