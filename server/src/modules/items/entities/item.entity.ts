import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../catalog/entities/category.entity';
import { Store } from '../../stores/entities/store.entity';
import { ItemType } from '../constants/item.constant';
import { Recipe } from './recipe.entity';

@Entity('items')
@Index(['name', 'store_id'], { unique: true })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'store_id' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'category_id', nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

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
    enum: ItemType,
    default: ItemType.PRODUCT,
  })
  type: ItemType;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isStockTracked: boolean;

  @OneToMany(() => Recipe, (recipe) => recipe.item, {
    cascade: true,
  })
  recipes: Recipe[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
