import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { AccountService } from '../accounts/account.service';
import { ProfileService } from '../profiles/profile.service';
import { OtpService } from '../notifications/otps/otp.service';
import { Account } from '../accounts/entities/account.entity';
import { CreateAccountDto } from '../accounts/dtos/account.dto';
import {
  CustomerLoginDto,
  StaffLoginDto,
  VerifyOtpDto,
} from './dtos/login.dto';
import { AuthResponseDto, JwtPayload } from './dtos/auth.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dtos/password.dto';
import { StoreRole } from '../stores/constants/store-role.constant';
import { StoreMemberService } from '../stores/services/store-member.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
    private readonly storeMemberService: StoreMemberService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async staffLogin(dto: StaffLoginDto): Promise<AuthResponseDto> {
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
    //check if staff has store
    return this.staffHasStore(account, dto.storeId);
  }

  async sendOtp(dto: CustomerLoginDto): Promise<void> {
    const account = await this.accountService.findByPhoneNumber(
      dto.phoneNumber,
    );
    this.ensureAccountExists(account);

    this.otpService.sendOtp(dto.phoneNumber);
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { phoneNumber, otp } = dto;

    this.ensureValidOtp(phoneNumber, otp);

    let account = await this.accountService.findByPhoneNumber(phoneNumber);

    if (!account) {
      account = await this.createCustomerAccount(phoneNumber);
    }

    return this.generateAuthResponse(account);
  }

  async register(dto: CreateAccountDto): Promise<AuthResponseDto> {
    const existing = await this.accountService.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Account already exists');
    }

    const account = await this.dataSource.transaction(async (manager) => {
      const hashedPassword = await this.hashPassword(dto.password);

      const account = await this.accountService.create(
        { ...dto, password: hashedPassword },
        manager,
      );

      await this.profileService.create(dto.profile, account, manager);

      return account;
    });

    return this.generateAuthResponse(account);
  }

  async forgotPassword(email: string): Promise<void> {
    const account = await this.accountService.findByEmail(email);

    this.ensureAccountExists(account);
    this.ensurePasswordLogin(account);

    this.otpService.sendOtp(email);
  }

  async verifyForgotPasswordOtp(email: string, otp: string): Promise<string> {
    const account = await this.accountService.findByEmail(email);

    this.ensureAccountExists(account);
    this.ensurePasswordLogin(account);
    this.ensureValidOtp(email, otp);

    return this.jwtService.sign({ sub: account.id }, { expiresIn: '5m' });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { email, resetToken, newPassword } = dto;

    const payload: JwtPayload = this.jwtService.verify(resetToken);
    const account = await this.accountService.findById(payload.sub);

    if (account.email !== email) {
      throw new BadRequestException('Account not found');
    }

    this.ensurePasswordLogin(account);

    const hashed = await this.hashPassword(newPassword);
    await this.accountService.updatePassword(account.id, hashed);
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword } = dto;

    if (oldPassword === newPassword) {
      throw new BadRequestException('New password cannot be the same as old');
    }

    const account = await this.accountService.findById(id);
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

  private ensureValidOtp(identifier: string, otp: string): void {
    const isValid = this.otpService.validateOtp(identifier, otp);

    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }
  }

  private async createCustomerAccount(phoneNumber: string): Promise<Account> {
    return this.accountService.createCustomer({
      phoneNumber,
      profile: { firstName: 'Customer', lastName: '' },
    } as CreateAccountDto);
  }

  private async staffHasStore(
    account: Account,
    requestedStoreId?: string,
  ): Promise<AuthResponseDto> {
    const store = await this.storeMemberService.findStoreByAccount(account.id);
    if (!store || store.length === 0) {
      throw new BadRequestException(
        'Staff account is not associated with any store',
      );
    }

    if (store.length > 1) {
      if (!requestedStoreId) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Multiple stores found. Please select one.',
          errorCode: 'STORE_SELECTION_REQUIRED',
          data: store,
        });
      }

      const selectedStore = store.find((s) => s.storeId === requestedStoreId);
      if (!selectedStore) {
        throw new BadRequestException(
          'Requested store not found in user associations',
        );
      }

      return this.generateAuthResponse(
        account,
        selectedStore.storeId,
        selectedStore.role,
      );
    }

    return this.generateAuthResponse(account, store[0].storeId, store[0].role);
  }

  private generateAuthResponse(
    account: Account,
    storeId?: string,
    storeRole?: StoreRole,
  ): AuthResponseDto {
    const payload = {
      sub: account.id,
      username: account.email || account.phoneNumber,
      storeId: storeId,
      storeRole: storeRole,
    };

    return {
      jwt: this.jwtService.sign(payload),
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
