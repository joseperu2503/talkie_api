import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('message_users')
export class MessageUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Message, (message) => message.messageUsers)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => UserEntity, (user) => user.chatUsers)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Fecha y hora de entrega
  @Column({ type: 'timestamp', nullable: true, name: 'delivered_at' })
  deliveredAt: Date | null;

  // Fecha y hora de lectura
  @Column({ type: 'timestamp', nullable: true, name: 'read_at' })
  readAt: Date | null;
}
