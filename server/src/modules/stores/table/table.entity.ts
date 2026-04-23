import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Zone } from '../zone/zone.entity';
import { TableStatus } from '../common/constants/table.constant';

@Entity('tables')
@Unique(['storeId', 'code'])
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @Column({ name: 'zone_id', type: 'uuid' })
  zoneId: string;

  @ManyToOne(() => Zone, (zone) => zone.tables)
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ type: 'int', default: 1 })
  capacity: number;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
