import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Role } from './constants/role.constant';
import { Roles } from '../auth/decorators/role.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('accounts')
@UseGuards(JwtGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  async activate(@Param('id') id: string): Promise<string> {
    await this.accountService.toggleActive(id, true);
    return 'Account activated successfully';
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string): Promise<string> {
    await this.accountService.toggleActive(id, false);
    return 'Account deactivated successfully';
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    await this.accountService.softDelete(id);
  }
}
