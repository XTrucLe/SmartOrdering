import { Store } from '@/modules/stores/entities/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ComboItem } from './combo-item.entity';

@Entity('combos')
@Check(`"discounted_price" <= "base_price"`)
@Check(`"valid_to" >= "valid_from"`)
@Check(`"quantity_limit" >= -1`)
export class Combo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  store: Store;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountedPrice: number;

  @OneToMany(() => ComboItem, (comboItem) => comboItem.combo, { cascade: true })
  comboItems: ComboItem[];

  @Column({ type: 'int', default: -1 })
  quantityLimit: number;

  @Column({ default: 0 })
  soldQty: number;

  @Column({ type: 'date' })
  validFrom: Date;

  @Column({ type: 'date', nullable: true })
  validTo?: Date;

  @CreateDateColumn()
  createdAt: Date;

  isSoldOut(): boolean {
    return this.quantityLimit !== -1 && this.soldQty >= this.quantityLimit;
  }

  getCurrentPrice(): number {
    return this.isValidNow() ? this.discountedPrice : this.basePrice;
  }

  isValidNow(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      (!this.validFrom || this.validFrom <= now) &&
      (!this.validTo || this.validTo >= now) &&
      !this.isSoldOut()
    );
  }
}
