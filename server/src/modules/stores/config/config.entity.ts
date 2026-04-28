import { Entity, Column, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Store } from '../store/store.entity';

@Entity('store_configs')
export class StoreConfig {
  @PrimaryColumn()
  storeId: string;

  @OneToOne(() => Store, (store) => store.config, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ type: 'jsonb', nullable: true })
  openingHours: Record<string, { open: string; close: string }>;

  @Column({ type: 'jsonb', nullable: true })
  theme: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  flags: {
    autoAcceptOrders: boolean;
    autoAcceptPayments: boolean;
  };
}
