import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SectionService } from '../services/section.service';
import { CreateSectionDto } from '../dtos/sections/create-section.dto';
import { UpdateSectionDto } from '../dtos/sections/update-section.dto';
import { SectionMapper } from '../mappers/section.mapper';
import { SectionResponseDto } from '../dtos/sections/section.response.dto';
import { UpdateSectionOrderDto } from '../dtos/sections/update-section-order.dto';

import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '@/modules/stores/common/guards/store-role.guard';
import { CurrentStore } from '@/modules/stores/common/decorators/current-store.decorator';
import { StoreContextDto } from '@/modules/stores/store/dtos/store-context.dto';
import { StoreOwner } from '@/modules/stores/common/decorators/store-role-group.decorator';

@UseGuards(JwtGuard, StoreRoleGuard)
@Controller()
export class SectionController {
  constructor(private readonly service: SectionService) {}

  @Post('menus/:menuId/sections')
  @StoreOwner()
  async create(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('menuId') menuId: string,
    @Body() dto: CreateSectionDto,
  ): Promise<SectionResponseDto> {
    const section = await this.service.create(storeId, menuId, dto);
    return SectionMapper.toResponseDto(section);
  }

  @Get('menus/:menuId/sections')
  async findAll(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('menuId') menuId: string,
  ): Promise<SectionResponseDto[]> {
    const sections = await this.service.getAllByMenu(storeId, menuId);
    return SectionMapper.toResponseDtoList(sections);
  }

  @Patch('menus/:menuId/sections/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  @StoreOwner()
  async reorder(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('menuId') menuId: string,
    @Body() dto: UpdateSectionOrderDto,
  ): Promise<void> {
    await this.service.reOrder(storeId, menuId, dto.sectionIds);
  }

  @Get('sections/:sectionId')
  async findOne(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('sectionId') sectionId: string,
  ): Promise<SectionResponseDto> {
    const section = await this.service.getSectionById(storeId, sectionId);
    return SectionMapper.toResponseDto(section);
  }

  @Patch('sections/:sectionId')
  @StoreOwner()
  async update(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
  ): Promise<SectionResponseDto> {
    const section = await this.service.update(storeId, sectionId, dto);
    return SectionMapper.toResponseDto(section);
  }

  @Delete('sections/:sectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @StoreOwner()
  async remove(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('sectionId') sectionId: string,
  ): Promise<void> {
    await this.service.remove(storeId, sectionId);
  }
}
