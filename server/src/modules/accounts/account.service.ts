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

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly profileService: ProfileService,
  ) {}

  private getRepository(manager?: EntityManager): Repository<Account> {
    return manager ? manager.getRepository(Account) : this.accountRepository;
  }

  private createEntity(
    dto: CreateAccountDto,
    role?: Role,
    manager?: EntityManager,
  ): Account {
    const repo = manager
      ? manager.getRepository(Account)
      : this.accountRepository;
    return repo.create({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: dto.password,
      ...(role && { role }),
    });
  }

  async getById(id: string): Promise<Account> {
    const account = await this.findById(id);
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async getActiveById(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, isActive: true },
    });
    if (!account) {
      throw new NotFoundException(`Active account with ID ${id} not found`);
    }
    return account;
  }

  async findById(id: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { email, isActive: true },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { phoneNumber, isActive: true },
    });
  }

  async create(
    dto: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<Account> {
    const repo = this.getRepository(manager);
    const account = this.createEntity(dto);
    return repo.save(account);
  }

  async createCustomer(
    dto: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<Account> {
    const repo = this.getRepository(manager);

    const account = this.createEntity(dto, Role.USER);
    const saved = await repo.save(account);

    await this.profileService.create(dto.profile, saved, manager);

    return saved;
  }

  async toggleActive(id: string, isActive: boolean): Promise<boolean> {
    const account = await this.getById(id);

    if (account.isActive === isActive) {
      throw new BadRequestException(
        `Account is already ${isActive ? 'active' : 'inactive'}`,
      );
    }

    account.isActive = isActive;
    await this.accountRepository.save(account);
    return true;
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<Account> {
    const account = await this.getActiveById(id);
    account.passwordHash = newPasswordHash;
    return this.accountRepository.save(account);
  }

  async softDelete(id: string): Promise<void> {
    await this.getById(id);
    await this.accountRepository.softDelete(id);
  }
}
