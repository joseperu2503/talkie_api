import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  flag: string;

  @Column('text')
  code: string;

  @Column('text')
  dialCode: string;

  @Column('text')
  mask: string;

  @OneToMany(() => User, (user) => user.phoneCountry)
  users: User[];
}
