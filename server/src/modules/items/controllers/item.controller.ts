import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { CurrentStore } from '@/modules/stores/common/decorators/current-store.decorator';
import { StoreOwner } from '@/modules/stores/common/decorators/store-role-group.decorator';
import { StoreRoleGuard } from '@/modules/stores/common/guards/store-role.guard';
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateItemDto, ItemDto } from '../dtos/item.dto';
import { ItemService } from '../services/item.service';
import { ItemMapper } from '../mappers/item.mapper';

@Controller('items')
@UseGuards(JwtGuard, StoreRoleGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @StoreOwner()
  async createItem(
    @CurrentStore('id') storeId: string,
    @Body() createItemDto: CreateItemDto,
  ): Promise<ItemDto> {
    const item = await this.itemService.createItem(storeId, createItemDto);
    return ItemMapper.toDto(item);
  }

  @Get()
  async getItems(@CurrentStore('id') storeId: string): Promise<ItemDto[]> {
    const items = await this.itemService.getAllByStore(storeId);
    return ItemMapper.toDtos(items);
  }

  @Get(':id')
  async getItem(
    @CurrentStore('id') storeId: string,
    @Param('id') itemId: string,
  ): Promise<ItemDto> {
    const item = await this.itemService.getItemById(storeId, itemId);
    return ItemMapper.toDto(item);
  }

  @Put(':id')
  @StoreOwner()
  async updateItem(
    @CurrentStore('id') storeId: string,
    @Param('id') itemId: string,
    @Body() updateItemDto: CreateItemDto,
  ): Promise<ItemDto> {
    const item = await this.itemService.updateItem(storeId, itemId, updateItemDto);
    return ItemMapper.toDto(item);
  }
}
