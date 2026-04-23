import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Store } from '@/modules/stores/store/store.entity';
import { Product } from './product.entity';

@Entity('categories')
@Unique('unique_category_name_store', ['name', 'store'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  store: Store;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  displayOrder: number;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
