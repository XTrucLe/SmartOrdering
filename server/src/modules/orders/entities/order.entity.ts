import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import {
  OrderStatus,
  PaymentStatus,
  DeliveryMethod,
  CancelReason,
} from '../constants/order.constant';
import { OrderItem } from './order-item.entity';
import { Table } from 'src/modules/stores/entities/table.entity';

@Entity('orders')
@Index(['storeId', 'createdAt'])
@Index(['storeId', 'status'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'order_code', length: 12 })
  orderCode: string;

  @Index()
  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Index()
  @Column({ name: 'table_id', nullable: true })
  tableId?: string;

  @ManyToOne(() => Table, { nullable: true })
  @JoinColumn({ name: 'table_id' })
  table?: Table;

  @Column({ name: 'table_name', nullable: true }) //Snapshot, không cần query table khi hiển thị order
  tableName?: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItem[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: DeliveryMethod,
    default: DeliveryMethod.DINE_IN,
  })
  deliveryMethod: DeliveryMethod;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Check(`"tax_rate" >= 0 AND "tax_rate" <= 0.5`)
  @Column('decimal', { precision: 5, scale: 4, default: 0 })
  taxRate: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'enum', enum: CancelReason, nullable: true })
  cancelReason?: CancelReason;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
