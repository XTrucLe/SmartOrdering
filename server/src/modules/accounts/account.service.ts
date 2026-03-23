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

  async createStaff(
    dto: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<Account> {
    const repository = manager
      ? manager.getRepository(Account)
      : this.accountRepository;

    const account = repository.create({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash: dto.password,
      role: dto.role,
    });

    return repository.save(account);
  }

  async createCustomer(
    dto: CreateAccountDto,
    manager?: EntityManager,
  ): Promise<Account> {
    const repository = manager
      ? manager.getRepository(Account)
      : this.accountRepository;

    const account = repository.create({
      ...dto,
      phoneNumber: dto.phoneNumber,
      role: Role.CUSTOMER,
    });

    const savedAccount = await repository.save(account);
    await this.profileService.create(dto.profile, savedAccount, manager);
    return savedAccount;
  }

  async toggleActive(id: string, isActive: boolean): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.isActive = isActive;
    return this.accountRepository.save(account);
  }

  async updateRole(id: string, role: Role): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.role === role) {
      throw new BadRequestException('Account already has this role');
    }

    account.role = role;
    return this.accountRepository.save(account);
  }

  async softDelete(id: string): Promise<void> {
    await this.accountRepository.softDelete(id);
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<Account> {
    const account = await this.findById(id);
    account.passwordHash = newPasswordHash;
    return this.accountRepository.save(account);
  }

  async findById(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: {
        email,
        isActive: true,
      },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: {
        phoneNumber,
        isActive: true,
      },
    });
  }
}
