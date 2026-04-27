import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store/store.entity';
import { Table } from './table/table.entity';
import { Zone } from './zone/zone.entity';
import { StoreMember } from './member/member.entity';
import { StoreService } from './store/store.service';
import { StoreController } from './store/store.controller';
import { StoreMemberService } from './member/member.service';
import { StoreMemberController } from './member/member.controller';
import { TableController } from './table/table.controller';
import { ZonesService } from './zone/zone.service';
import { TableService } from './table/table.service';
import { ZoneController } from './zone/zone.controller';
import { IdentityModule } from '../identity/identity.module';
import { StoreConfig } from './config/config.entity';
import { StoreConfigService } from './config/config.service';
import { StoreConfigController } from './config/config.controller';
import { OnboardingService } from './onboarding/onboarding.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Zone, Table, StoreMember, StoreConfig]),
    IdentityModule,
  ],
  controllers: [
    StoreController,
    StoreMemberController,
    TableController,
    ZoneController,
    StoreConfigController,
  ],
  providers: [
    OnboardingService,
    StoreService,
    StoreMemberService,
    ZonesService,
    TableService,
    StoreConfigService,
  ],
  exports: [
    OnboardingService,
    StoreService,
    StoreMemberService,
    ZonesService,
    TableService,
    StoreConfigService,
  ],
})
export class StoresModule {}
