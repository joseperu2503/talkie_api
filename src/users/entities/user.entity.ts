import { ChatUser } from 'src/chat/entities/chat-user.entity';
import { Message } from 'src/chat/entities/message.entity';
import { Contact } from 'src/contacts/entities/contact.entity';
import { Country } from 'src/countries/entities/country.entity';
import { FcmToken } from 'src/notifications/entities/fcm-token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Unique(['phoneCountry', 'phone']) // Define la restricción única compuesta
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Country, (country) => country.users, { nullable: true })
  @JoinColumn({ name: 'phone_country_id' })
  phoneCountry: Country | null;

  @Column('number', { nullable: true, name: "phone_country_id" })
  phoneCountryId: number | null;

  @Column('text', { nullable: true })
  phone: string | null;

  @Column('text', { nullable: true })
  photo: string | null;

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
}
