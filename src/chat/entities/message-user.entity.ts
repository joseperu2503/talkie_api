import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Message } from './message.entity';

@Entity('message_users')
export class MessageUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Message, (message) => message.messageUsers)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => User, (user) => user.chatUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Fecha y hora de entrega
  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date | null;

  // Fecha y hora de lectura
  @Column({ type: 'timestamp', nullable: true })
  read_at: Date | null;
}
