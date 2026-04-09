import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { MenuSection } from './menu-section.entity';
import { Product } from '@/modules/catalog/entities/product.entity';

@Entity('menu_items')
@Index(['sectionId', 'productId'], { unique: true })
@Check(`"price" >= 0`)
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'section_id' })
  sectionId: string;

  @ManyToOne(() => MenuSection, (menuSection) => menuSection.menuItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  menuSection: MenuSection;

  @Index()
  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
