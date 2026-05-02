import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Account } from '@/modules/identity/entities/account.entity';
import { StoreConfig } from '../config/config.entity';
import { StoreStatus } from '../common/constants/store-status.constant';
import { StoreMember } from '../member/member.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  ownerId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: Account;

  @Index({ unique: true })
  @Column({ length: 100 })
  slug: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: StoreStatus, default: StoreStatus.PENDING })
  status: StoreStatus;

  @Column({ length: 500 })
  streetAddress: string;

  @Column({ length: 100 })
  ward: string;

  @Column({ length: 100 })
  province: string;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  latitude?: number;

  @OneToMany(() => StoreMember, (member) => member.store)
  members: StoreMember[];

  @OneToOne(() => StoreConfig, (config) => config.store)
  config: StoreConfig;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
