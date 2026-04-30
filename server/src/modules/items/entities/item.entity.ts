import { Store } from '@/modules/stores/store/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { OptionGroup } from './option-group.entity';

@Entity('items')
@Index(['storeId', 'name'], { unique: true })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  storeId: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  basePrice: number;

  @OneToMany(() => OptionGroup, (group) => group.item, { cascade: true })
  optionGroup: OptionGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
