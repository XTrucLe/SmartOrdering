import { Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { AccountService } from '../services/account.service';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../constants/role.constant';

@Controller('accounts')
@UseGuards(JwtGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  async activate(@Param('id') id: string): Promise<string> {
    await this.accountService.activate(id);
    return 'Account activated successfully';
  }

  @Patch(':id/inactivate')
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string): Promise<string> {
    await this.accountService.deactivate(id);
    return 'Account deactivated successfully';
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    await this.accountService.softDelete(id);
  }
}
