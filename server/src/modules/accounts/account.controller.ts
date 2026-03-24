import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { Role } from './constants/role.constant';
import { Roles } from '../auth/decorators/role.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('accounts')
@UseGuards(JwtGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  activate(@Param('id') id: string): Promise<Account> {
    return this.accountService.toggleActive(id, true);
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  deactivate(@Param('id') id: string): Promise<Account> {
    return this.accountService.toggleActive(id, false);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.accountService.softDelete(id);
  }
}
