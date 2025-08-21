import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from 'src/auth/entities/user.entity';
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
  @ManyToOne(() => UserEntity, (user) => user.initiatedContacts)
  @JoinColumn({ name: 'user_id' })
  ownerUser: UserEntity;

  // El usuario que está siendo agregado como contacto
  @ManyToOne(() => UserEntity, (user) => user.receivedContacts)
  @JoinColumn({ name: 'contact_id' })
  targetContact: UserEntity;

  @ManyToOne(() => Chat, (chat) => chat.contacts)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

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
