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
} from 'typeorm';
import { Account } from '@/modules/identity/entities/account.entity';
import { StoreConfig } from '../config/config.entity';
import { StoreStatus } from '../common/constants/store-status.constant';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountId: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

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

  @OneToOne(() => StoreConfig, (config) => config.store)
  config: StoreConfig;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
