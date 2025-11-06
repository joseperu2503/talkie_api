import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
