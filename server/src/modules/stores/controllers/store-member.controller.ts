import { Body, Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { StoreMemberService } from '../services/store-member.service';
import {
  CreateStoreMemberDto,
  StoreMemberResponseDto,
} from '../dtos/store-members/store-member.dto';
import { mapToStoreMemberDto, mapToStoreMemberDtos } from '../mappers/store-member.mapper';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '../guards/store-role.guard';
import { CurrentStore } from '../decorators/current-store.decorator';
import { StoreInfo } from '../dtos/stores/store-info.dto';
import { StoreManager, StoreOwner } from '../decorators/store-role-group.decorator';

@Controller('/members')
@UseGuards(JwtGuard, StoreRoleGuard)
export class StoreMemberController {
  constructor(private readonly storeMemberService: StoreMemberService) {}

  @Post('managers')
  @StoreManager()
  async createManager(
    @CurrentStore() store: StoreInfo,
    @Body() dto: CreateStoreMemberDto,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.createManager(store.id, dto.account);
    return mapToStoreMemberDto(member);
  }

  @Post('staff')
  @StoreOwner()
  async createStaff(
    @CurrentStore() store: StoreInfo,
    @Body() dto: CreateStoreMemberDto,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.createStaff(store.id, dto.account);
    return mapToStoreMemberDto(member);
  }

  @Get()
  @StoreManager()
  async listMembers(@CurrentStore() store: StoreInfo): Promise<StoreMemberResponseDto[]> {
    const members = await this.storeMemberService.listStoreMembers(store.id);
    return mapToStoreMemberDtos(members);
  }

  @Get(':userId')
  @StoreManager()
  async getMember(
    @CurrentStore() store: StoreInfo,
    @Param('userId') userId: string,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.findMemberOrFail(store.id, userId);
    return mapToStoreMemberDto(member);
  }

  @Delete(':userId')
  @StoreOwner()
  async deleteMember(
    @CurrentStore() store: StoreInfo,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.storeMemberService.removeStoreMember(store.id, userId);
  }
}
