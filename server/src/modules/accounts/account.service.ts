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

  private async findOrFail(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, isActive: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  private createEntity(dto: CreateAccountDto, role?: Role): Account {
    return this.accountRepository.create({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: dto.password,
      ...(role && { role }),
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

  async toggleActive(id: string, isActive: boolean): Promise<Account> {
    const account = await this.findOrFail(id);
    if (account.isActive === isActive) {
      throw new BadRequestException('Account already has this status');
    }

    account.isActive = isActive;
    return this.accountRepository.save(account);
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<Account> {
    const account = await this.findOrFail(id);
    account.passwordHash = newPasswordHash;
    return this.accountRepository.save(account);
  }

  async softDelete(id: string): Promise<void> {
    await this.findOrFail(id);
    await this.accountRepository.softDelete(id);
  }

  async findById(id: string): Promise<Account> {
    return this.findOrFail(id);
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
}
