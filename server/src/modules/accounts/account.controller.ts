import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { Role } from './constants/role.constant';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch(':id/active')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  async toggleActiveStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ): Promise<Account> {
    return this.accountService.toggleActive(id, isActive);
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN, Role.OWNER)
  async updateRole(
    @Param('id') id: string,
    @Body('role') role: Role,
  ): Promise<Account> {
    return this.accountService.updateRole(id, role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  async delete(@Param('id') id: string): Promise<void> {
    return this.accountService.softDelete(id);
  }
}
