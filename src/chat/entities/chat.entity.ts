import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { ChatUser } from './chat-user.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToOne(() => Message)
  @JoinColumn({ name: 'last_message' })
  lastMessage: Message;

  @OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
  chatUsers: ChatUser[];
}
