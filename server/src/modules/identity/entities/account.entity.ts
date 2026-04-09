import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from '../constants/role.constant';

@Entity('accounts')
@Index('IDX_account_email', ['email'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
@Index('IDX_account_phone', ['phoneNumber'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: false })
  isActive: boolean;

  @OneToOne(() => Profile, (profile) => profile.account)
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
