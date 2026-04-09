import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Check } from 'typeorm';
import { Combo } from './combo.entity';

@Entity('combo_items')
@Check(`"quantity" > 0`)
@Check(`"price" >= 0`)
export class ComboItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comboId: string;

  @ManyToOne(() => Combo, { onDelete: 'CASCADE' })
  combo: Combo;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column()
  productImageUrl: string;

  @Column()
  productUnit: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  getTotalPrice(): number {
    return this.quantity * this.price;
  }
}
