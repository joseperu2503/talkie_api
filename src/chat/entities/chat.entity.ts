import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Message } from './message.entity';
import { Contact } from 'src/contacts/entities/contact.entity';
import { ChatUser } from './chat-user.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'last_message' })
  lastMessage: Message;

  @Column('int', { array: true, name: 'users_id' })
  usersId: number[];

  @OneToMany(() => Contact, (contact) => contact.chat)
  contacts: Contact[];

  @OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
  chatUsers: ChatUser[];
}
