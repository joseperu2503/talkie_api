import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
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
