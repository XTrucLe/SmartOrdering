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
import { Section } from './section.entity';
import { Item } from '@/modules/items/entities/item.entity';

@Entity('section_items')
@Index(['sectionId', 'itemId'], { unique: true })
@Check(`"price" >= 0`)
export class SectionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'section_id' })
  sectionId: string;

  @ManyToOne(() => Section, (section) => section.sectionItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Index()
  @Column()
  itemId: string;

  @ManyToOne(() => Item, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

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

  @Column({ type: 'jsonb', nullable: true })
  options: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
