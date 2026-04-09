import { Store } from '@/modules/stores/entities/store.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity('ingredients')
@Unique('unique_ingredient_name_store', ['name', 'storeId'])
@Unique('unique_ingredient_code_store', ['code', 'storeId'])
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20 })
  baseUnit: string;

  @Column({ type: 'varchar', length: 20 })
  importUnit: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '1.00',
  })
  conversionRate: string;

  @OneToOne(() => Stock, (stock) => stock.ingredient, {
    cascade: true,
  })
  stock: Stock;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Auto-generate code before inserting a new ingredient
  @BeforeInsert()
  generateCode() {
    if (!this.code || this.code.trim() === '') {
      const timePart = Date.now().toString(36).slice(-4).toUpperCase();
      const randomPath = Math.random().toString(36).substring(2, 6).toUpperCase();
      this.code = `ING-${timePart}${randomPath}`;
    }
  }
}
