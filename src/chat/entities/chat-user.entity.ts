import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/users/entities/user.entity';

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

  @Column({ type: 'int', default: 0, name: 'unread_messages_count' })
  unreadMessagesCount: number;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
