import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => Account, (account) => account.profile, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'account_id' })
  account?: Account;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ length: 255, nullable: true })
  streetAddress?: string;

  @Column({ length: 100, nullable: true })
  ward?: string;

  @Column({ length: 100, nullable: true })
  province?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
