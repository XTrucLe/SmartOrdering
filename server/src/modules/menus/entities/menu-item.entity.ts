import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { MenuSection } from './menu-section.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('menu_items')
@Index(['menuSectionId', 'itemId'], { unique: true })
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'menu_section_id' })
  menuSectionId: string;

  @ManyToOne(() => MenuSection, (menuSection) => menuSection.menuItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'menu_section_id' })
  menuSection: MenuSection;

  @Index()
  @Column({ name: 'item_id' })
  itemId: string;

  @ManyToOne(() => Item, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({
    name: 'override_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  overridePrice?: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
