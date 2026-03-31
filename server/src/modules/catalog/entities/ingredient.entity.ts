import { Store } from '@/modules/stores/entities/store.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('ingredients')
@Unique('unique_ingredient_name_store', ['name', 'store'])
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  unitMeasure: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  unitCost: string;

  @Column({ default: true })
  isActive: boolean;
}
