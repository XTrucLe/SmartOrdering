import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './order.entity';
import { decimalTransformer } from '@/common/utils/decimal.transformer';
import { DeliveryStatus } from '../constants/delivery.constant';

@Entity('deliveries')
@Index(['status'])
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  @OneToOne(() => Order, (order) => order.delivery, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'receiver_name' })
  receiverName: string;

  @Column({ name: 'receiver_phone' })
  receiverPhone: string;

  @Column()
  streetAddress: string;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column('decimal', {
    name: 'delivery_fee',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  deliveryFee: number;

  @Column({ nullable: true })
  shipperName?: string;

  @Column({ nullable: true })
  shipperPhone?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  getFullAddress(): string {
    return `${this.streetAddress}, ${this.ward}, ${this.district}, ${this.province}`;
  }
}
