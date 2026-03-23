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
import { Profile } from '../../profiles/entities/profile.entity';
import { Role } from '../constants/role.constant';

@Entity('accounts')
@Index('IDX_email_role', ['email', 'role'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
@Index('IDX_phone_role', ['phoneNumber', 'role'], {
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

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Column({ default: true })
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
