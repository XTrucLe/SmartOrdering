import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Store } from '../../stores/store/store.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus, DeliveryMethod } from '../constants/order.constant';
import { decimalTransformer } from '@/common/utils/decimal.transformer';
import { Delivery } from './delivery.entity';
import { PaymentMethod, PaymentStatus } from '../constants/payment.constant';

@Entity('orders')
@Index(['storeId', 'createdAt'])
@Index(['storeId', 'status'])
@Index(['storeId', 'paymentStatus'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 20 })
  orderCode: string;

  @Column()
  storeId: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  orderItems: OrderItem[];

  @OneToOne(() => Delivery, (delivery) => delivery.order, {
    cascade: ['insert'],
    nullable: true,
  })
  delivery?: Delivery;

  @Column({ nullable: true })
  customerId?: string;

  @Column({ nullable: true })
  customerName?: string;

  @Column({ nullable: true })
  customerPhone?: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.DRAFT,
  })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod: PaymentMethod;

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

  @Column({
    nullable: true,
  })
  cancelReason?: string;
  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  subTotal: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  discountTotal: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  taxTotal: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  grandTotal: number;

  @Column('text', { nullable: true })
  note?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  paidAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
