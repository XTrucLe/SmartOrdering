import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Store } from '@/modules/stores/entities/store.entity';
import { ReceiptItem } from './receipt-item.entity';
import { ReceiptStatus } from '../constants/receipt.constant';

@Entity('receipts')
@Index('unique_receipt_code_storeId', ['code', 'storeId'], { unique: true })
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  code: string;

  @Column()
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  store: Store;

  @Column({ type: 'varchar', length: 255 })
  supplier: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255 })
  deliverer: string;

  @Column({ type: 'varchar', length: 255 })
  accepter: string;

  @Column({ type: 'enum', enum: ReceiptStatus, default: ReceiptStatus.DRAFT })
  status: ReceiptStatus;

  @OneToMany(() => ReceiptItem, (item) => item.receipt, { cascade: true })
  items: ReceiptItem[];

  @Column('decimal', { precision: 12, scale: 2 })
  totalCost: number;

  @CreateDateColumn()
  createdAt: Date;
}
