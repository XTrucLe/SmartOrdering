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
import { SectionItemService } from '../services/section-item.service';
import { StoreRoleGuard } from '@/modules/stores/common/guards/store-role.guard';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreManager } from '@/modules/stores/common/decorators/store-role-group.decorator';
import { CurrentStore } from '@/modules/stores/common/decorators/current-store.decorator';
import { StoreContextDto } from '@/modules/stores/store/dtos/store-context.dto';

import { CreateSectionItemDto } from '../dtos/section-items/create-section-item.dto';
import {
  UpdateSectionItemDto,
  UpdateSectionItemOrderDto,
} from '../dtos/section-items/update-section-item.dto';

import { SectionItemDto } from '../dtos/section-items/section-item-response.dto';
import { SectionItemMapper } from '../mappers/section-item.mapper';

@UseGuards(JwtGuard, StoreRoleGuard)
@Controller()
export class SectionItemController {
  constructor(private readonly service: SectionItemService) {}

  @Post('sections/:sectionId/items')
  @StoreManager()
  async create(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateSectionItemDto,
  ): Promise<SectionItemDto> {
    const item = await this.service.create(storeId, sectionId, dto);
    return SectionItemMapper.toDto(item);
  }

  @Get('sections/:sectionId/items')
  async findAll(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('sectionId') sectionId: string,
  ): Promise<SectionItemDto[]> {
    const items = await this.service.getAllBySection(storeId, sectionId);
    return SectionItemMapper.toDtos(items);
  }

  @Patch('sections/:sectionId/item/:itemId/sync')
  @StoreManager()
  async syncSectionItem(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('sectionId') sectionId: string,
    @Param('itemId') itemId: string,
  ): Promise<SectionItemDto> {
    const item = await this.service.syncSectionItems(storeId, sectionId, itemId);
    return SectionItemMapper.toDto(item);
  }

  @Patch('sections/:sectionId/items/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  @StoreManager()
  async reorder(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionItemOrderDto,
  ): Promise<void> {
    await this.service.reOrder(storeId, sectionId, dto);
  }

  @Get('section-items/:itemId')
  async findOne(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('itemId') itemId: string,
  ): Promise<SectionItemDto> {
    const item = await this.service.findOne(storeId, itemId);
    return SectionItemMapper.toDto(item);
  }

  @Patch('section-items/:itemId')
  @StoreManager()
  async update(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateSectionItemDto,
  ): Promise<SectionItemDto> {
    const item = await this.service.update(storeId, itemId, dto);
    return SectionItemMapper.toDto(item);
  }

  @Delete('section-items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @StoreManager()
  async remove(
    @CurrentStore() { id: storeId }: StoreContextDto,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    await this.service.remove(storeId, itemId);
  }
}
