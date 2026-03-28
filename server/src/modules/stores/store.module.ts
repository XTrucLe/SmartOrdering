import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../accounts/account.module';
import { Store } from './entities/store.entity';
import { Table } from 'typeorm';
import { Zone } from './entities/zone.entity';
import { StoreMember } from './entities/store-member.entity';
import { StoresService } from './services/stores.service';
import { StoresController } from './controllers/store.controller';
import { StoreMemberService } from './services/store-member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Zone, Table, StoreMember]),
    AccountModule,
  ],
  controllers: [StoresController],
  providers: [StoresService, StoreMemberService],
  exports: [StoresService, StoreMemberService],
})
export class StoresModule {}
