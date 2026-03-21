import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Category } from '../../catalog/entities/category.entity';
import { Store } from '../../stores/entities/store.entity';
import { ItemStatus, ItemType } from '../constants/item.constant';

@Entity('items')
@Index(['name', 'store'], { unique: true })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.ACTIVE,
  })
  status: ItemStatus;

  @Column({
    type: 'enum',
    enum: ItemType,
    default: ItemType.OTHER,
  })
  type: ItemType;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;

  @ManyToOne(() => Store, (store) => store.id)
  store: Store;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
