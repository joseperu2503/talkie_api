import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/auth/entities/user.entity';

@Entity('fcm_tokens')
export class FcmToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  token: string;

  @ManyToOne(() => User, (user) => user.fcmTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
