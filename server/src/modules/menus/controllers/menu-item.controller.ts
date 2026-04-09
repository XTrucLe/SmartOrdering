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
import { MenuItemService } from '../services/menu-item.service';
import { CreateMenuItemDto } from '../dtos/menu-items/create-menu-item.dto';
import { UpdateMenuItemDto, UpdateMenuItemOrderDto } from '../dtos/menu-items/update-menu-item.dto';
import { MenuItemResponseDto } from '../dtos/menu-items/menu-item.response.dto';
import { MenuItemMapper } from '../mappers/menu-item.mapper';
import { StoreRoleGuard } from '@/modules/stores/guards/store-role.guard';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreManager } from '@/modules/stores/decorators/store-role-group.decorator';
import { CurrentStore } from '@/modules/stores/decorators/current-store.decorator';
import { StoreInfo } from '@/modules/stores/dtos/stores/store-info.dto';

@UseGuards(JwtGuard, StoreRoleGuard)
@Controller()
export class MenuItemController {
  constructor(private readonly service: MenuItemService) {}

  @Post('menu-sections/:sectionId/menu-items')
  @StoreManager()
  async create(
    @CurrentStore() { id: storeId }: StoreInfo,
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const item = await this.service.create(storeId, sectionId, dto);
    return MenuItemMapper.toResponseDto(item);
  }

  @Get('menu-sections/:sectionId/menu-items')
  async findAll(
    @CurrentStore() { id: storeId }: StoreInfo,
    @Param('sectionId') sectionId: string,
  ): Promise<MenuItemResponseDto[]> {
    const items = await this.service.findAllBySection(storeId, sectionId);
    return MenuItemMapper.toResponseDtoList(items);
  }

  @Patch('menu-sections/:sectionId/menu-items/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  @StoreManager()
  async reorder(
    @CurrentStore() { id: storeId }: StoreInfo,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateMenuItemOrderDto,
  ): Promise<void> {
    await this.service.updateOrder(storeId, sectionId, dto);
  }

  @Get('menu-items/:itemId')
  async findOne(
    @CurrentStore() { id: storeId }: StoreInfo,
    @Param('itemId') itemId: string,
  ): Promise<MenuItemResponseDto> {
    const item = await this.service.findOne(storeId, itemId);
    return MenuItemMapper.toResponseDto(item);
  }

  @Patch('menu-items/:itemId')
  @StoreManager()
  async update(
    @CurrentStore() { id: storeId }: StoreInfo,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const item = await this.service.update(storeId, itemId, dto);
    return MenuItemMapper.toResponseDto(item);
  }

  @Delete('menu-items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @StoreManager()
  async remove(
    @CurrentStore() { id: storeId }: StoreInfo,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    await this.service.remove(storeId, itemId);
  }
}
