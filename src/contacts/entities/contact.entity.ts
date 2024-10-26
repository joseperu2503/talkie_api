import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    nullable: true,
  })
  alias: string;

  // El usuario que está iniciando/agregando el contacto
  @ManyToOne(() => User, (user) => user.initiatedContacts)
  @JoinColumn({ name: 'user_id' })
  ownerUser: User;

  // El usuario que está siendo agregado como contacto
  @ManyToOne(() => User, (user) => user.receivedContacts)
  @JoinColumn({ name: 'contact_id' })
  targetContact: User;

  @ManyToOne(() => Chat, (chat) => chat.contacts)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;
}
