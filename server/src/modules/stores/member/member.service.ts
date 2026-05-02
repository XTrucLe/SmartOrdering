import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreMember } from './member.entity';
import { StoreService } from '../store/store.service';
import { RoleHierarchy, StoreRole } from '../common/constants/store-role.constant';
import { StoreMaxMembers } from '../common/constants/store-limit.constant';
import { CreateAccountDto } from '@/modules/identity/dtos/account.dto';
import { AccountService } from '@/modules/identity/services/account.service';
import { BaseService } from '@/common/services/base.service';
import { StoreContextDto } from '../store/dtos/store-context.dto';
import { StoreStatus } from '../common/constants/store-status.constant';
import { handleError } from '@/common/utils/handle-error';

@Injectable()
export class StoreMemberService extends BaseService<StoreMember> {
  constructor(
    @InjectRepository(StoreMember)
    repository: Repository<StoreMember>,
    private readonly accountService: AccountService,
    private readonly storeService: StoreService,
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
    if (member.role === StoreRole.OWNER) {
      throw new ConflictException('Cannot remove the owner of the store.');
    }
    await this.getRepo().remove(member);
  }

  async findMemberOrFail(storeId: string, userId: string): Promise<StoreMember> {
    const member = await this.getRepo().findOne({
      where: { store: { id: storeId }, account: { id: userId } },
      relations: ['account', 'account.profile'],
    });

    if (!member) throw new NotFoundException('Member not found.');
    return member;
  }

  async listStoreMembers(storeId: string): Promise<StoreMember[]> {
    const members = await this.getRepo().find({
      where: { store: { id: storeId } },
      relations: ['account', 'account.profile'],
      order: { account: { profile: { firstName: 'ASC' } } },
    });

    return members.sort((a, b) => RoleHierarchy[a.role] - RoleHierarchy[b.role]);
  }

  async findStoresByAccount(accountId: string) {
    const members = await this.getRepo().find({
      where: { account: { id: accountId } },
      relations: ['store', 'store.account'],
    });

    return members.map((m) => ({
      id: m.store.id,
      slug: m.store.slug,
      role: m.role,
    }));
  }

  async getStoreContext(accountId: string, storeId: string): Promise<StoreContextDto> {
    try {
      const member = await this.getRepo().findOneOrFail({
        where: { account: { id: accountId }, store: { id: storeId } },
        relations: ['store', 'store.account'],
        select: {
          id: true,
          role: true,
          store: {
            id: true,
            slug: true,
          },
        },
      });

      return {
        id: member.store.id,
        slug: member.store.slug,
        role: member.role,
      };
    } catch (err) {
      throw new ForbiddenException('Unauthorized to access store context.');
    }
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

    const store = await this.storeService.getStoreById(storeId, manager);

    if (store.status === StoreStatus.PENDING && role !== StoreRole.OWNER) {
      throw new BadRequestException(`Can't add members to a store that is pending approval.`);
    }
    await this.enforceRoleLimit(storeId, role, repo);

    const member = repo.create({
      store,
      role,
      account: { id: userId },
    });

    try {
      return await repo.save(member);
    } catch (err) {
      handleError(err);
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
