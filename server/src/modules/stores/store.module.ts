import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store/store.entity';
import { StoreMember } from './member/member.entity';
import { StoreService } from './store/store.service';
import { StoreController } from './store/store.controller';
import { StoreMemberService } from './member/member.service';
import { StoreMemberController } from './member/member.controller';
import { IdentityModule } from '../identity/identity.module';
import { StoreConfig } from './config/config.entity';
import { StoreConfigService } from './config/config.service';
import { StoreConfigController } from './config/config.controller';
import { OnboardingService } from './onboarding/onboarding.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreMember, StoreConfig]), IdentityModule],
  controllers: [StoreController, StoreMemberController, StoreConfigController],
  providers: [OnboardingService, StoreService, StoreMemberService, StoreConfigService],
  exports: [OnboardingService, StoreService, StoreMemberService, StoreConfigService],
})
export class StoresModule {}
