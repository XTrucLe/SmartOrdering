import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Table } from './entities/table.entity';
import { Zone } from './entities/zone.entity';
import { StoreMember } from './entities/store-member.entity';
import { StoresService } from './services/stores.service';
import { StoresController } from './controllers/store.controller';
import { StoreMemberService } from './services/store-member.service';
import { StoreMemberController } from './controllers/store-member.controller';
import { TableController } from './controllers/table.controller';
import { ZonesService } from './services/zone.service';
import { TableService } from './services/table.service';
import { ZoneController } from './controllers/zone.controller';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Zone, Table, StoreMember]),
    forwardRef(() => IdentityModule),
  ],
  controllers: [StoresController, StoreMemberController, TableController, ZoneController],
  providers: [StoresService, StoreMemberService, ZonesService, TableService],
  exports: [StoresService, StoreMemberService, ZonesService, TableService],
})
export class StoresModule {}
