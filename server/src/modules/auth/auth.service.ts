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
import { Role, ROLE_LEVELS } from '../accounts/constants/role.constant';
import { CreateAccountDto } from '../accounts/dtos/account.dto';
import {
  CustomerLoginDto,
  StaffLoginDto,
  VeryfyOtpDto,
} from './dtos/login.dto';
import { AuthResponseDto } from './dtos/auth.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dtos/password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async staffLogin(dto: StaffLoginDto): Promise<AuthResponseDto> {
    const account = await this.accountService.findByEmail(dto.email);

    if (!account) {
      throw new BadRequestException('Invalid email or password');
    }

    this.validateRole(account, true);

    if (!account.passwordHash) {
      throw new BadRequestException(
        'Account does not login with email and password',
      );
    }

    const isMatch = await this.comparePassword(
      dto.password,
      account.passwordHash,
    );

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: account.id,
      username: account.email,
      role: account.role,
    };

    return {
      jwt: this.jwtService.sign(payload),
      role: account.role,
    };
  }

  async sendOTP(dto: CustomerLoginDto): Promise<void> {
    const { phoneNumber } = dto;
    const account = await this.accountService.findByPhoneNumber(phoneNumber);

    if (account) {
      this.validateRole(account, false);
    }

    this.otpService.sendOtp(phoneNumber);
  }

  async verifyOTP(dto: VeryfyOtpDto): Promise<AuthResponseDto> {
    const { phoneNumber, otp } = dto;

    const isOtpValid = this.otpService.validateOtp(phoneNumber, otp);

    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    let account = await this.accountService.findByPhoneNumber(phoneNumber);

    if (!account) {
      account = await this.accountService.createCustomer({
        phoneNumber,
        profile: { firstName: 'Customer', lastName: '' },
      } as CreateAccountDto);
    } else {
      this.validateRole(account, false);
    }

    return this.generateAuthResponse(account);
  }

  async register(dto: CreateAccountDto): Promise<AuthResponseDto> {
    const existingAccount = await this.accountService.findByEmail(dto.email);

    if (existingAccount) {
      throw new ConflictException('Account already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let account: Account;

    try {
      const hashedPassword = await this.hashPassword(dto.password);

      account = await this.accountService.createStaff(
        { ...dto, password: hashedPassword },
        queryRunner.manager,
      );

      await this.profileService.create(
        dto.profile,
        account,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new ConflictException(`Error creating account: ${error.message}`);
    } finally {
      await queryRunner.release();
    }

    return this.generateAuthResponse(account);
  }

  async forgotPassword(email: string): Promise<void> {
    const account = await this.accountService.findByEmail(email);

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (!account.passwordHash) {
      throw new BadRequestException(
        'Account does not login with email and password',
      );
    }

    this.otpService.sendOtp(email);
  }

  async verifyFogotPasswordOtp(email: string, otp: string): Promise<string> {
    const account = await this.accountService.findByEmail(email);

    const isOtpValid = this.otpService.validateOtp(email, otp);

    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!account) {
      throw new BadRequestException('Account not found');
    }
    if (!account.passwordHash) {
      throw new BadRequestException(
        'Account does not login with email and password',
      );
    }

    return this.jwtService.sign({ sub: account.id }, { expiresIn: '5m' });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { email, resetToken, newPassword } = dto;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const payload = this.jwtService.verify(resetToken) as { sub: string };
    const { sub: id } = payload;
    const account = await this.accountService.findById(id);

    if (!account || account.email !== email) {
      throw new BadRequestException('Account not found');
    }
    if (!account.passwordHash) {
      throw new BadRequestException(
        'Account does not login with email and password',
      );
    }
    const hashedPassword = await this.hashPassword(newPassword);
    await this.accountService.updatePassword(account.id, hashedPassword);
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    const { oldPassword, newPassword } = dto;
    if (oldPassword === newPassword) {
      throw new BadRequestException('New password cannot be the same as old');
    }

    const account = await this.accountService.findById(id);
    if (!account.passwordHash) {
      throw new BadRequestException(
        'Account does not login with email and password',
      );
    }

    const isMatch = await this.comparePassword(
      oldPassword,
      account.passwordHash,
    );

    if (!isMatch) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await this.accountService.updatePassword(account.id, hashedPassword);
  }

  //utils
  private generateAuthResponse(account: Account): AuthResponseDto {
    const payload = {
      sub: account.id,
      username: account.email || account.phoneNumber,
      role: account.role,
    };

    return {
      jwt: this.jwtService.sign(payload),
      role: account.role,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private validateRole(account: Account, isStaff: boolean = true): void {
    const accountRoleLevel = ROLE_LEVELS[account.role];
    const staffRoleLevel = ROLE_LEVELS[Role.STAFF];

    if (isStaff && accountRoleLevel < staffRoleLevel) {
      throw new BadRequestException('Only staff can login with this method');
    }

    if (!isStaff && accountRoleLevel >= staffRoleLevel) {
      throw new BadRequestException(
        'Only customers can login with this method',
      );
    }
  }
}
