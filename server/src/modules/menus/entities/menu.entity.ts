import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { MenuType } from '../constants/menus.constant';
import { Store } from '../../stores/entities/store.entity';
import { MenuSection } from './menu-section.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: MenuType,
    default: MenuType.MAIN,
  })
  type: MenuType;

  @OneToMany(() => MenuSection, (menuSection) => menuSection.menu, {
    cascade: true,
  })
  menuSections: MenuSection[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
