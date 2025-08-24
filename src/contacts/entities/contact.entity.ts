import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from 'src/auth/entities/user.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@Entity('contacts')
export class Contact {
  @Column('text', {
    nullable: true,
  })
  alias: string;

  // 🔑 Parte de la clave primaria (usuario que agrega)
  @PrimaryColumn({ name: 'owner_user_id' })
  ownerUserId: number;

  // 🔑 Parte de la clave primaria (usuario agregado)
  @PrimaryColumn({ name: 'target_user_id' })
  tartgetUserId: number;

  // El usuario que está iniciando/agregando el contacto
  @ManyToOne(() => UserEntity, (user) => user.initiatedContacts)
  @JoinColumn({ name: 'owner_user_id' })
  ownerUser: UserEntity;

  // El usuario que está siendo agregado como contacto
  @ManyToOne(() => UserEntity, (user) => user.receivedContacts)
  @JoinColumn({ name: 'target_user_id' })
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
