import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { Option } from './option.entity';
import { GroupType } from '../types/group-type.enum';

@Entity('option_groups')
@Check(`"min_selection" >= 0 AND "max_selection" >= 1 AND "min_selection" <= "max_selection"`)
export class OptionGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => Item, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: GroupType })
  groupType: GroupType;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ default: 1 })
  minSelection: number;

  @Column({ default: 1 })
  maxSelection: number;

  @OneToMany(() => Option, (option) => option.group, { cascade: true, eager: true })
  options: Option[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
