import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity('chat_users')
export class ChatUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.chatUsers)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.chatUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('bool', {
    default: true,
    name: 'is_active',
  })
  isActive: boolean;
}
