import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Store } from '../store/store.entity';
import { Account } from '@/modules/identity/entities/account.entity';
import { StoreRole } from '../common/constants/store-role.constant';

@Entity('store_members')
@Index(['storeId', 'role'], { unique: true, where: `"role" = 'owner'` })
@Index(['accountId'], { unique: true, where: `"role" != 'owner'` })
@Index(['storeId', 'accountId'], { unique: true })
export class StoreMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountId: string;

  @Column()
  storeId: string;

  @Column({
    type: 'enum',
    enum: StoreRole,
    default: StoreRole.STAFF,
  })
  role: StoreRole;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
