import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ProfileModule } from '../profiles/profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), ProfileModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
