import { Message } from 'src/chat/entities/message.entity';
import { Contact } from 'src/contacts/entities/contact.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @Column('text', {
    unique: true,
  })
  phone: string;

  @Column('text', {
    unique: true,
  })
  username: string;

  @Column('text', { nullable: true })
  photo: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Contact, (contact) => contact.ownerUser)
  initiatedContacts: Contact[];

  @OneToMany(() => Contact, (contact) => contact.targetContact)
  receivedContacts: Contact[];
}
