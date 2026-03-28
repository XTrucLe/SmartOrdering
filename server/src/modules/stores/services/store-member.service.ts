import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreMember } from '../entities/store-member.entity';
import { StoresService } from './stores.service';
import { RoleHierarchy, StoreRole } from '../constants/store-role.constant';
import { StoreMaxMembers } from '../constants/store-limit.constant';
import { CreateAccountDto } from '@/modules/accounts/dtos/account.dto';
import { AccountService } from '@/modules/accounts/account.service';

@Injectable()
export class StoreMemberService {
  constructor(
    @InjectRepository(StoreMember)
    private readonly storeMemberRepository: Repository<StoreMember>,
    private readonly accountService: AccountService,
    private readonly storesService: StoresService,
  ) {}

  async createOwner(storeId: string, userId: string): Promise<StoreMember> {
    return this.addStoreMember(storeId, StoreRole.OWNER, userId);
  }

  async createManager(
    storeId: string,
    staffInfo: CreateAccountDto,
  ): Promise<StoreMember> {
    return this.ensureMemberExists(storeId, staffInfo, StoreRole.MANAGER);
  }

  async createStaff(
    storeId: string,
    staffInfo: CreateAccountDto,
  ): Promise<StoreMember> {
    return this.ensureMemberExists(storeId, staffInfo, StoreRole.STAFF);
  }

  async removeStoreMember(storeId: string, userId: string): Promise<void> {
    const member = await this.findMemberOrFail(storeId, userId);
    await this.storeMemberRepository.remove(member);
  }

  async findMemberOrFail(
    storeId: string,
    userId: string,
  ): Promise<StoreMember> {
    const member = await this.storeMemberRepository.findOneBy({
      store: { id: storeId },
      account: { id: userId },
    });
    if (!member) {
      throw new NotFoundException('Member not found.');
    }
    return member;
  }

  async listStoreMembers(storeId: string): Promise<StoreMember[]> {
    const memberlist = await this.storeMemberRepository.find({
      where: { store: { id: storeId } },
      relations: ['account', 'account.profile'],
    });

    return (
      memberlist?.sort(
        (a, b) => RoleHierarchy[a.role] - RoleHierarchy[b.role], // DESC: OWNER > MANAGER > STAFF
      ) ?? []
    );
  }

  async findStoreByAccount(accountId: string) {
    const member = await this.storeMemberRepository.find({
      where: { account: { id: accountId } },
      relations: ['store'],
    });
    return (
      member?.map((m) => {
        return { storeId: m.store.id, slug: m.store.slug, role: m.role };
      }) ?? []
    );
  }

  private async ensureMemberExists(
    storeId: string,
    account: CreateAccountDto,
    role: StoreRole,
  ): Promise<StoreMember> {
    const existingAccount = await this.accountService.findByEmail(
      account.email,
    );

    if (existingAccount)
      return this.addStoreMember(storeId, role, existingAccount.id);

    const newAccount = await this.accountService.create(account);

    return this.addStoreMember(storeId, role, newAccount.id);
  }

  private async addStoreMember(
    storeId: string,
    role: StoreRole,
    userId: string,
  ): Promise<StoreMember> {
    const store = await this.storesService.getStoreById(storeId);

    await this.limitRoles(storeId, role);

    const storeMember = this.storeMemberRepository.create({
      store,
      role,
      account: { id: userId },
    });
    try {
      return await this.storeMemberRepository.save(storeMember);
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === '23505') {
        throw new ConflictException('User is already a member of this store.');
      }
      throw err;
    }
  }

  private async limitRoles(storeId: string, role: StoreRole): Promise<void> {
    const maxMembers = StoreMaxMembers[role];

    if (!maxMembers || maxMembers === -1) return; // No limit if not defined

    const count = await this.storeMemberRepository.count({
      where: { storeId, role },
    });

    if (count >= maxMembers) {
      throw new ConflictException(
        `Cannot add more members with role ${role}. Maximum allowed is ${maxMembers}.`,
      );
    }
  }
}
