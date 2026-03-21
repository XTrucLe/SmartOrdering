import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { Ingredient } from 'src/modules/catalog/entities/ingredient.entity';

@Entity('recipes')
@Index(['itemId', 'ingredientId'], { unique: true })
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'item_id' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Index()
  @Column({ name: 'ingredient_id' })
  ingredientId: string;

  @ManyToOne(() => Ingredient, { onDelete: 'RESTRICT' }) // Tránh xóa nguyên liệu nếu đang được sử dụng trong công thức
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column('decimal', { precision: 10, scale: 3 })
  quantity: number;
}
