import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Check } from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity('stocks')
@Check('"quantity" >= 0')
export class Stock {
  @PrimaryColumn('uuid')
  ingredientId: string;

  @OneToOne(() => Ingredient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
    default: 0.0,
  })
  quantity: number;
}
