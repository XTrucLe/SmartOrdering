import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { AccountService } from '@/modules/identity/services/account.service';
import { RegisNewOwnerDto } from '../store/dtos/create-store.dto';
import { DataSource } from 'typeorm';
import { StoreMemberService } from '../member/member.service';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly storeService: StoreService,
    private readonly accountService: AccountService,
    private readonly memberService: StoreMemberService,
    private readonly datasource: DataSource,
  ) {}

  async createNewOwner(dto: RegisNewOwnerDto) {
    return this.datasource.transaction(async (manager) => {
      const { store, ...accountDto } = dto;

      const account = await this.accountService.create(accountDto, manager);

      const newStore = await this.storeService.createStore(account.id, store, manager);

      await this.memberService.createOwner(newStore.id, account.id, manager);

      return { name: account.profile.firstName, email: account.email, storeName: newStore.name };
    });
  }
}
