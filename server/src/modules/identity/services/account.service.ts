import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { CreateAccountDto, CreateCustomerDto } from '../dtos/account.dto';
import { Role } from '../constants/role.constant';
import { ProfileService } from './profile.service';
import { BaseService } from '@/common/services/base.service';
import { PasswordService } from './password.service';

@Injectable()
export class AccountService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account)
    repository: Repository<Account>,
    private readonly profileService: ProfileService,
    private readonly passwordService: PasswordService,
  ) {
    super(repository, Account);
  }

  async findById(id: string, manager?: EntityManager): Promise<Account | null> {
    return this.getRepo(manager).findOneBy({ id });
  }

  async findByEmail(email: string, manager?: EntityManager): Promise<Account | null> {
    return this.getRepo(manager).findOne({
      where: { email, isActive: true },
    });
  }

  async findByPhoneNumber(phoneNumber: string, manager?: EntityManager): Promise<Account | null> {
    return this.getRepo(manager).findOne({
      where: { phoneNumber, isActive: true },
    });
  }

  async getById(id: string, manager?: EntityManager): Promise<Account> {
    const account = await this.findById(id, manager);
    if (!account) {
      throw new NotFoundException(`Account ${id} not found`);
    }
    return account;
  }

  async getActiveById(id: string, manager?: EntityManager): Promise<Account> {
    const account = await this.getRepo(manager).findOne({
      where: { id, isActive: true },
    });

    if (!account) {
      throw new NotFoundException(`Active account ${id} not found`);
    }

    return account;
  }

  async create(dto: CreateAccountDto, manager?: EntityManager): Promise<Account> {
    return this.createAccount(dto, Role.USER, manager);
  }

  async createCustomer(dto: CreateCustomerDto, manager?: EntityManager): Promise<Account> {
    const existingAccount = await this.findByPhoneNumber(dto.phoneNumber, manager);

    if (existingAccount) {
      throw new ConflictException('Account with this phone number already exists.');
    }

    const repo = this.getRepo(manager);

    const account = repo.create({
      phoneNumber: dto.phoneNumber,
      role: Role.CUSTOMER,
      isActive: true,
    });

    account.profile = await this.profileService.create(dto.profile, account, manager);

    try {
      return await repo.save(account);
    } catch (err) {
      this.handleDbError(err);
    }
  }

  private async createAccount(
    dto: CreateAccountDto,
    role?: Role,
    manager?: EntityManager,
  ): Promise<Account> {
    const repo = this.getRepo(manager);

    const hassedPassword = await this.passwordService.hashPassword(dto.password);

    const account = repo.create({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: hassedPassword,
      ...(role && { role }),
    });

    let savedAccount: Account;

    try {
      savedAccount = await repo.save(account);
      savedAccount.profile = await this.profileService.create(dto.profile, savedAccount, manager);
    } catch (err) {
      this.handleDbError(err);
    }

    return savedAccount;
  }

  async getOrNewCustomer(dto: CreateCustomerDto, manager?: EntityManager): Promise<Account> {
    const existingAccount = await this.findByPhoneNumber(dto.phoneNumber, manager);
    if (existingAccount) {
      return existingAccount;
    }

    return this.createCustomer(dto, manager);
  }

  async updatePassword(id: string, newPassword: string, manager?: EntityManager): Promise<Account> {
    const repo = this.getRepo(manager);

    const account = await this.getActiveById(id, manager);
    account.passwordHash = await this.passwordService.hashPassword(newPassword);

    return repo.save(account);
  }

  async activate(id: string, manager?: EntityManager): Promise<boolean> {
    return this.updateActiveStatus(id, true, manager);
  }

  async deactivate(id: string, manager?: EntityManager): Promise<boolean> {
    return this.updateActiveStatus(id, false, manager);
  }

  private async updateActiveStatus(
    id: string,
    isActive: boolean,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepo(manager);
    const account = await this.getById(id, manager);

    if (account.isActive === isActive) {
      throw new BadRequestException(`Account already ${isActive ? 'active' : 'inactive'}`);
    }

    account.isActive = isActive;
    await repo.save(account);

    return true;
  }

  async softDelete(id: string, manager?: EntityManager): Promise<void> {
    await this.getById(id, manager);
    await this.getRepo(manager).softDelete(id);
  }

  private handleDbError(err: unknown): never {
    if (err instanceof Error && 'code' in err && err.code === '23505') {
      throw new UnprocessableEntityException('Entity already exists.');
    }

    throw err;
  }
}
