import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Receipt } from './receipt.entity';
import { Ingredient } from './ingredient.entity';

@Entity('receipt_items')
export class ReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  receiptId: string;

  @ManyToOne(() => Receipt, (receipt) => receipt.items, { onDelete: 'CASCADE' })
  receipt: Receipt;

  @Column()
  ingredientId: string;

  @ManyToOne(() => Ingredient, { onDelete: 'CASCADE' })
  ingredient: Ingredient;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  unitCost: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalCost: number;
}
