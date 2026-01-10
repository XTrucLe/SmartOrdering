import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import {
  OrderStatus,
  PaymentStatus,
  DeliveryMethod,
} from '../constants/order.constant';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store, (store) => store.id)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'store_id', nullable: true, insert: false, update: false })
  storeId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItem[];

  @Column({ nullable: true })
  customerName?: string;

  @Column({ nullable: true })
  customerContact?: string;

  @Column({ nullable: true })
  customerAddress?: string;

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

  @Column({ nullable: true })
  table?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
