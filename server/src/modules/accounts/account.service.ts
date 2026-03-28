import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dtos/account.dto';
import { Role } from './constants/role.constant';
import { ProfileService } from '../profiles/profile.service';
import { BaseService } from '@/common/services/base.service';

@Injectable()
export class AccountService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account)
    repository: Repository<Account>,
    private readonly profileService: ProfileService,
  ) {
    super(repository, Account);
  }

  private createEntity(
    dto: CreateAccountDto,
    role?: Role,
    manager?: EntityManager,
  ): Account {
    return this.getRepo(manager).create({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: dto.password,
      ...(role && { role }),
    });
  }

  async findById(id: string, manager?: EntityManager): Promise<Account | null> {
    return this.getRepo(manager).findOneBy({ id });
  }

  async findByEmail(
    email: string,
    manager?: EntityManager,
  ): Promise<Account | null> {
    return this.getRepo(manager).findOne({
      where: { email, isActive: true },
    });
  }

  async findByPhoneNumber(
    phoneNumber: string,
    manager?: EntityManager,
  ): Promise<Account | null> {
    return this.getRepo(manager).findOne({
      where: { phoneNumber, isActive: true },
    });
  }

  async getById(id: string, manager?: EntityManager): Promise<Account> {
    const account = await this.findById(id, manager);
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async getActiveById(id: string, manager?: EntityManager): Promise<Account> {
    const account = await this.getRepo(manager).findOne({
      where: { id, isActive: true },
    });

    if (!account) {
      throw new NotFoundException(`Active account with ID ${id} not found`);
    }

    return account;
  }

  async create(
    dto: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<Account> {
    const repo = this.getRepo(manager);
    const account = this.createEntity(dto, undefined, manager);
    return repo.save(account);
  }

  async createCustomer(
    dto: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<Account> {
    const repo = this.getRepo(manager);

    const account = this.createEntity(dto, Role.USER, manager);
    const saved = await repo.save(account);

    await this.profileService.create(dto.profile, saved, manager);

    return saved;
  }

  async updatePassword(
    id: string,
    newPasswordHash: string,
    manager?: EntityManager,
  ): Promise<Account> {
    const repo = this.getRepo(manager);

    const account = await this.getActiveById(id, manager);
    account.passwordHash = newPasswordHash;

    return repo.save(account);
  }

  async toggleActive(
    id: string,
    isActive: boolean,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepo(manager);

    const account = await this.getById(id, manager);

    if (account.isActive === isActive) {
      throw new BadRequestException(
        `Account is already ${isActive ? 'active' : 'inactive'}`,
      );
    }

    account.isActive = isActive;
    await repo.save(account);

    return true;
  }

  async softDelete(id: string, manager?: EntityManager): Promise<void> {
    const repo = this.getRepo(manager);

    await this.getById(id, manager);
    await repo.softDelete(id);
  }
}
