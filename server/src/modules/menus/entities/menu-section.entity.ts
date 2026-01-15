import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Menu } from './menu.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu_sections')
export class MenuSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Menu, (menu) => menu.menuSections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.menuSection)
  menuItems: MenuItem[];
}
