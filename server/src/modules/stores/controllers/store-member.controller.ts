import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { StoreMemberService } from '../services/store-member.service';
import {
  CreateStoreMemberDto,
  StoreMemberResponseDto,
} from '../dtos/store-members/store-member.dto';
import { mapToStoreMemberDto } from '../mappers/store-member.mapper';

@Controller('stores/:storeId/members')
export class StoreMemberController {
  constructor(private readonly storeMemberService: StoreMemberService) {}

  @Post('create/manager')
  async createManager(
    @Param('storeId') storeId: string,
    @Body() dto: CreateStoreMemberDto,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.createManager(
      storeId,
      dto.newStaff,
    );
    return mapToStoreMemberDto(member);
  }

  @Post('create/staff')
  async createStaff(
    @Param('storeId') storeId: string,
    @Body() dto: CreateStoreMemberDto,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.createStaff(
      storeId,
      dto.newStaff,
    );
    return mapToStoreMemberDto(member);
  }

  @Delete(':userId')
  async removeMember(
    @Param('storeId') storeId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.storeMemberService.removeStoreMember(storeId, userId);
  }

  @Get('members')
  async listMembers(
    @Param('storeId') storeId: string,
  ): Promise<StoreMemberResponseDto[]> {
    const members = await this.storeMemberService.listStoreMembers(storeId);
    return members.map(mapToStoreMemberDto);
  }

  @Get(':userId')
  async getMember(
    @Param('storeId') storeId: string,
    @Param('userId') userId: string,
  ): Promise<StoreMemberResponseDto> {
    const member = await this.storeMemberService.findMemberOrFail(
      storeId,
      userId,
    );
    return mapToStoreMemberDto(member);
  }
}
