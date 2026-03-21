import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoresService } from './stores.service';
import { StoresController } from './store.controller';
import { Table } from 'typeorm';
import { Zone } from './entities/zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Zone, Table])],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
