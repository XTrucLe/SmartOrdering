import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OptionGroup } from './option-group.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  groupId: string;

  @ManyToOne(() => OptionGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: OptionGroup;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  extraPrice: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 0 })
  displayOrder: number;
}
