import { ChatUser } from 'src/chat/entities/chat-user.entity';
import { Message } from 'src/chat/entities/message.entity';
import { Contact } from 'src/contact/entities/contact.entity';
import { FcmToken } from 'src/notification/entities/fcm-token.entity';
import { Phone } from 'src/phone/entities/phone.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: true,
  })
  email: string | null;

  @Column('text')
  password: string;

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @ManyToOne(() => Phone, { nullable: true })
  @JoinColumn({ name: 'phone_id' })
  phone: Phone | null;

  @Column('text', { nullable: true, name: 'phone_id', unique: true })
  phoneId: string | null;

  @Column('text', { nullable: true })
  photo: string | null;

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Contact, (contact) => contact.ownerUser)
  initiatedContacts: Contact[];

  @OneToMany(() => Contact, (contact) => contact.targetContact)
  receivedContacts: Contact[];

  @OneToMany(() => ChatUser, (chatUser) => chatUser.user)
  chatUsers: ChatUser[];

  @Column('boolean', {
    default: false,
    name: 'is_connected',
  })
  isConnected: boolean;

  @Column('timestamptz', {
    name: 'last_connection',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastConnection: Date;

  @OneToMany(() => FcmToken, (fcmToken) => fcmToken.user)
  fcmTokens: FcmToken[];

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
