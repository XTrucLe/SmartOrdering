import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto, JwtPayload, LoginDto } from '../dtos/auth.dto';
import { AccountService } from './account.service';
import { Account } from '../entities/account.entity';
import { ChangePasswordDto } from '../dtos/account.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    readonly passwordService: PasswordService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const account = await this.accountService.findByEmail(dto.email);
    this.ensureAccountExists(account);
    this.ensurePasswordLogin(account);

    const isMatch = await this.passwordService.comparePassword(dto.password, account.passwordHash!);

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    return this.generateAuthResponse(account);
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

    const isMatch = await this.passwordService.comparePassword(oldPassword, account.passwordHash!);

    if (!isMatch) {
      throw new BadRequestException('Invalid old password');
    }

    await this.accountService.updatePassword(account.id, newPassword);
  }

  private ensureAccountExists(account: Account | null): asserts account is Account {
    if (!account) {
      throw new BadRequestException('Account not found');
    }
  }

  private ensurePasswordLogin(account: Account): void {
    if (!account.passwordHash) {
      throw new BadRequestException('Account does not support password login');
    }
  }

  private generateAuthResponse(account: Account): AuthResponseDto {
    const username = account.email ?? account.phoneNumber ?? `user_${account.id.substring(0, 8)}`;

    const payload: JwtPayload = {
      sub: account.id,
      username: username,
      globalRole: account.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      globalRole: account.role,
      user: {
        id: account.id,
        username: username,
      },
    };
  }
}
