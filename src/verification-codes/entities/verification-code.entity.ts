import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verification_codes')
export class VerificationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  code: string;

  @Column({ type: 'timestamp', nullable: false, name: 'expiration_time' })
  expirationTime: Date;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'boolean', default: false })
  verified: boolean;
}
