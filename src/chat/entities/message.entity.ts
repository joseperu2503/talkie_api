import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
