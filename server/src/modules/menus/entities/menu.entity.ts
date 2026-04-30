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
import { Store } from '../../stores/store/store.entity';
import { Section } from './section.entity';

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

  @OneToMany(() => Section, (section) => section.menu, {
    cascade: true,
  })
  sections: Section[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
