import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { MenuSection } from './menu-section.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('menu_items')
@Unique(['menuSection', 'item'])
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Item, (item) => item.id, { onDelete: 'CASCADE' })
  item: Item;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => MenuSection, (menuSection) => menuSection.menuItems, {
    onDelete: 'CASCADE',
  })
  menuSection: MenuSection;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;
}
