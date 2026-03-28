import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { AccountService } from '../accounts/account.service';
import { ProfileService } from '../profiles/profile.service';
import { Account } from '../accounts/entities/account.entity';
import { AuthResponseDto, JwtPayload, StoreInfo } from './dtos/auth.dto';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/password.dto';
import { OwnerRegisterDto } from './dtos/register.dto';
import { StoresService } from '../stores/services/stores.service';
import { StoreMemberService } from '../stores/services/store-member.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
    private readonly storeService: StoresService,
    private readonly storeMemberService: StoreMemberService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const account = await this.accountService.findByEmail(dto.email);
    this.ensureAccountExists(account);
    this.ensurePasswordLogin(account);

    const isMatch = await this.comparePassword(
      dto.password,
      account.passwordHash!,
    );

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    return this.checkAccount(account);
  }

  async loginWithStore(
    accountId: string,
    storeId: string,
  ): Promise<AuthResponseDto> {
    const account = await this.accountService.findById(accountId);
    this.ensureAccountExists(account);

    const existingStores =
      await this.storeMemberService.findStoreByAccount(accountId);

    if (!existingStores || existingStores.length === 0) {
      throw new BadRequestException('No store access found for this account');
    }

    if (existingStores.length >= 1 && existingStores[0].id !== storeId) {
      throw new BadRequestException(
        'Selected store does not match account access',
      );
    }

    return this.checkAccount(account, storeId);
  }

  async register(dto: OwnerRegisterDto): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const hashedPassword = await this.hashPassword(dto.password);

        const account = await this.accountService.create(
          { ...dto, password: hashedPassword },
          manager,
        );

        await this.profileService.create(dto.profile, account, manager);

        const store = await this.storeService.createStore(
          account.id,
          dto.store,
          manager,
        );

        await this.storeMemberService.createOwner(
          store.id,
          account.id,
          manager,
        );
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23505') {
        throw new BadRequestException('Email or phone number already in use');
      }
      throw error;
    }
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword } = dto;

    if (oldPassword === newPassword) {
      throw new BadRequestException('New password cannot be the same as old');
    }

    const account = await this.accountService.findById(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    this.ensurePasswordLogin(account);

    const isMatch = await this.comparePassword(
      oldPassword,
      account.passwordHash!,
    );

    if (!isMatch) {
      throw new BadRequestException('Invalid old password');
    }

    const hashed = await this.hashPassword(newPassword);
    await this.accountService.updatePassword(account.id, hashed);
  }

  private ensureAccountExists(
    account: Account | null,
  ): asserts account is Account {
    if (!account) {
      throw new BadRequestException('Account not found');
    }
  }

  private ensurePasswordLogin(account: Account): void {
    if (!account.passwordHash) {
      throw new BadRequestException('Account does not support password login');
    }
  }

  private async checkAccount(
    account: Account,
    selectedStoreId?: string,
  ): Promise<AuthResponseDto> {
    const stores = await this.storeMemberService.findStoreByAccount(account.id);

    if (!stores || stores.length === 0) {
      return this.generateAuthResponse(account);
    }

    if (stores.length === 1) {
      return this.generateAuthResponse(account, undefined, stores[0]);
    }

    if (selectedStoreId) {
      const activeStore = stores.find((store) => store.id === selectedStoreId);

      if (!activeStore) {
        throw new ForbiddenException(
          'You do not have access to the selected store',
        );
      }

      return this.generateAuthResponse(account, undefined, activeStore);
    }

    return this.generateAuthResponse(account, stores);
  }

  private generateAuthResponse(
    account: Account,
    store?: StoreInfo[],
    activeStore?: StoreInfo,
  ): AuthResponseDto {
    const username =
      account.email ??
      account.phoneNumber ??
      `user_${account.id.substring(0, 8)}`;

    const payload: JwtPayload = {
      sub: account.id,
      username: username,
      globalRole: account.role,
      store: activeStore,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      globalRole: account.role,
      user: {
        id: account.id,
        username: username,
      },
      store: store,
      activeStore: activeStore,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
