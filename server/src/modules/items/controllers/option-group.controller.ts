import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { CurrentStore } from '@/modules/stores/common/decorators/current-store.decorator';
import { StoreOwner } from '@/modules/stores/common/decorators/store-role-group.decorator';
import { StoreRoleGuard } from '@/modules/stores/common/guards/store-role.guard';
import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OptionGroupService } from '../services/option-group.service';
import {
  CreateOptionGroupDto,
  OptionGroupDto,
  UpdateOptionGroupDto,
} from '../dtos/option-group.dto';
import { OptionGroupMapper } from '../mappers/option-group.mapper';

@Controller()
@UseGuards(JwtGuard, StoreRoleGuard)
export class OptionGroupController {
  constructor(private readonly optionGroupService: OptionGroupService) {}

  @Post('items/:itemId/option-groups')
  @StoreOwner()
  async createOptionGroup(
    @CurrentStore('id') storeId: string,
    @Param('itemId') itemId: string,
    @Body() createOptionGroupDto: CreateOptionGroupDto,
  ): Promise<OptionGroupDto> {
    const optionGroup = await this.optionGroupService.createGroup(
      storeId,
      itemId,
      createOptionGroupDto,
    );
    return OptionGroupMapper.toDto(optionGroup);
  }

  @Patch('option-groups/:groupId')
  @StoreOwner()
  async updateOptionGroup(
    @CurrentStore('id') storeId: string,
    @Param('groupId') groupId: string,
    @Body() updateOptionGroupDto: UpdateOptionGroupDto,
  ): Promise<OptionGroupDto> {
    const optionGroup = await this.optionGroupService.updateGroup(
      storeId,
      groupId,
      updateOptionGroupDto,
    );
    return OptionGroupMapper.toDto(optionGroup);
  }

  @Delete('option-groups/:groupId')
  @StoreOwner()
  async deleteOptionGroup(
    @CurrentStore('id') storeId: string,
    @Param('groupId') groupId: string,
  ): Promise<void> {
    await this.optionGroupService.deleteGroup(storeId, groupId);
  }
}
