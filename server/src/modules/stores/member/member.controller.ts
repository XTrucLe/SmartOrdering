import { Body, Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { StoreMemberService } from './member.service';
import { CreateStoreMemberDto, StoreMemberResponseDto } from './dtos/member.dto';
import { mapToStoreMemberDto, mapToStoreMemberDtos } from './member.mapper';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '../common/guards/store-role.guard';
import { CurrentStore } from '../common/decorators/current-store.decorator';
import { StoreContextDto } from '../store/dtos/store-context.dto';
import { StoreManager, StoreOwner } from '../common/decorators/store-role-group.decorator';

@Controller('/members')
@UseGuards(JwtGuard, StoreRoleGuard)
export class StoreMemberController {
  constructor(private readonly storeMemberService: StoreMemberService) {}

  @Post('managers')
  @StoreManager()
  async createManager(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateStoreMemberDto,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.createManager(store.id, dto.account);
    return mapToStoreMemberDto(member);
  }

  @Post('staff')
  @StoreOwner()
  async createStaff(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateStoreMemberDto,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.createStaff(store.id, dto.account);
    return mapToStoreMemberDto(member);
  }

  @Get()
  @StoreManager()
  async listMembers(@CurrentStore() store: StoreContextDto): Promise<StoreMemberResponseDto[]> {
    const members = await this.storeMemberService.listStoreMembers(store.id);
    return mapToStoreMemberDtos(members);
  }

  @Get(':userId')
  @StoreManager()
  async getMember(
    @CurrentStore() store: StoreContextDto,
    @Param('userId') userId: string,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.findMemberOrFail(store.id, userId);
    return mapToStoreMemberDto(member);
  }

  @Delete(':userId')
  @StoreOwner()
  async deleteMember(
    @CurrentStore() store: StoreContextDto,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.storeMemberService.removeStoreMember(store.id, userId);
  }
}
