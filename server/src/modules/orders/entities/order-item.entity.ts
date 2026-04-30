import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './order.entity';
import { SectionItem } from '../../menus/entities/section-item.entity';
import { decimalTransformer } from '@/common/utils/decimal.transformer';

@Entity('order_items')
@Index(['orderId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ nullable: true })
  sectionItemId?: string;

  @ManyToOne(() => SectionItem, { nullable: true })
  @JoinColumn({ name: 'section_item_id' })
  sectionItem?: SectionItem;

  @Column({ name: 'item_name' })
  itemName: string;

  @Column('int')
  quantity: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: decimalTransformer,
  })
  unitPrice: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: decimalTransformer,
  })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
