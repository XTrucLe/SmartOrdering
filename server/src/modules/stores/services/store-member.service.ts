import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreMember } from '../entities/store-member.entity';
import { StoresService } from './stores.service';
import { RoleHierarchy, StoreRole } from '../constants/store-role.constant';
import { StoreMaxMembers } from '../constants/store-limit.constant';
import { CreateAccountDto } from '@/modules/accounts/dtos/account.dto';
import { AccountService } from '@/modules/accounts/account.service';
import { BaseService } from '@/common/services/base.service';

@Injectable()
export class StoreMemberService extends BaseService<StoreMember> {
  constructor(
    @InjectRepository(StoreMember)
    repository: Repository<StoreMember>,
    private readonly accountService: AccountService,
    private readonly storesService: StoresService,
  ) {
    super(repository, StoreMember);
  }

  async createOwner(
    storeId: string,
    userId: string,
    manager?: EntityManager,
  ): Promise<StoreMember> {
    return this.addStoreMember(storeId, StoreRole.OWNER, userId, manager);
  }

  async createManager(
    storeId: string,
    dto: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<StoreMember> {
    return this.ensureMember(storeId, dto, StoreRole.MANAGER, manager);
  }

  async createStaff(
    storeId: string,
    dto: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<StoreMember> {
    return this.ensureMember(storeId, dto, StoreRole.STAFF, manager);
  }

  async removeStoreMember(storeId: string, userId: string): Promise<void> {
    const member = await this.findMemberOrFail(storeId, userId);
    await this.getRepo().remove(member);
  }

  async findMemberOrFail(
    storeId: string,
    userId: string,
  ): Promise<StoreMember> {
    const member = await this.getRepo().findOneBy({
      store: { id: storeId },
      account: { id: userId },
    });

    if (!member) throw new NotFoundException('Member not found.');
    return member;
  }

  async listStoreMembers(storeId: string): Promise<StoreMember[]> {
    const members = await this.getRepo().find({
      where: { store: { id: storeId } },
      relations: ['account', 'account.profile'],
    });

    return members.sort(
      (a, b) => RoleHierarchy[a.role] - RoleHierarchy[b.role],
    );
  }

  async findStoreByAccount(accountId: string) {
    const members = await this.getRepo().find({
      where: { account: { id: accountId } },
      relations: ['store'],
    });

    return members.map((m) => ({
      storeId: m.store.id,
      slug: m.store.slug,
      role: m.role,
    }));
  }

  private async ensureMember(
    storeId: string,
    dto: CreateAccountDto,
    role: StoreRole,
    manager?: EntityManager,
  ): Promise<StoreMember> {
    const account =
      (await this.accountService.findByEmail(dto.email)) ??
      (await this.accountService.create(dto, manager));

    return this.addStoreMember(storeId, role, account.id, manager);
  }

  private async addStoreMember(
    storeId: string,
    role: StoreRole,
    userId: string,
    manager?: EntityManager,
  ): Promise<StoreMember> {
    const repo = this.getRepo(manager);

    const store = await this.storesService.getStoreById(storeId, manager);

    await this.enforceRoleLimit(storeId, role, repo);

    const member = repo.create({
      store,
      role,
      account: { id: userId },
    });

    try {
      return await repo.save(member);
    } catch (err) {
      if (err instanceof Error && 'code' in err && err?.code === '23505') {
        throw new ConflictException('User is already a member of this store.');
      }
      throw err;
    }
  }

  private async enforceRoleLimit(
    storeId: string,
    role: StoreRole,
    repo: Repository<StoreMember>,
  ): Promise<void> {
    const max = StoreMaxMembers[role];

    if (!max || max === -1) return;

    const count = await repo.count({
      where: { store: { id: storeId }, role },
    });

    if (count >= max) {
      throw new ConflictException(`Max ${role} reached (${max}).`);
    }
  }
}
