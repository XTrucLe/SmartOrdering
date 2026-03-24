import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoresService } from './services/stores.service';
import { StoresController } from './controllers/store.controller';
import { Table } from 'typeorm';
import { Zone } from './entities/zone.entity';
import { StoreMemberService } from './services/store-member.service';
import { AccountModule } from '../accounts/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Zone, Table]), AccountModule],
  controllers: [StoresController],
  providers: [StoresService, StoreMemberService],
  exports: [StoresService, StoreMemberService],
})
export class StoresModule {}
