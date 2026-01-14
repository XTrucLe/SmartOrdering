import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { CategoryStatus } from '../constants/category.constant';
import { Item } from '../../items/entities/item.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;

  @ManyToOne(() => Store, (store) => store.id, { onDelete: 'CASCADE' })
  store: Store;

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
