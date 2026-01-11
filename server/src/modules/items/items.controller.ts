import {
  Controller,
  Param,
  Put,
  Post,
  Get,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { ItemStatus } from './constants/item.constant';
import {
  mapToItemDto,
  mapToItemDtos,
  mapToItemWithStoreDto,
} from './mappers/item.mapper';
import {
  ItemResponseDto,
  ItemWithStoreResponseDto,
} from './dtos/item.response.dto';

@Controller('stores/:storeId/items')
export class ItemController {
  constructor(private readonly itemsService: ItemsService) {}
  @Post()
  async createItem(
    @Param('storeId') storeId: string,
    @Body() dto: CreateItemDto,
  ): Promise<ItemResponseDto> {
    const item = await this.itemsService.createItem(storeId, dto);
    return mapToItemDto(item);
  }
  @Get(':id')
  async getItemById(
    @Param('id') id: string,
  ): Promise<ItemWithStoreResponseDto> {
    const item = await this.itemsService.getItemById(id);
    return mapToItemWithStoreDto(item);
  }

  @Put(':id')
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    const item = await this.itemsService.updateItem(id, dto);
    return mapToItemDto(item);
  }
  @Put(':id/change-status')
  async changeItemStatus(
    @Param('id') id: string,
    @Body('status') status: ItemStatus,
  ): Promise<ItemResponseDto> {
    const item = await this.itemsService.toggleItemStatus(id, status);
    return mapToItemDto(item);
  }

  @Delete(':id')
  async deleteItem(@Param('id') id: string) {
    return this.itemsService.deleteItem(id);
  }

  @Get()
  async queryItems(
    @Param('storeId') storeId: string,
    @Query('query') query?: string,
    @Query('menuId') menuId?: string,
  ): Promise<ItemResponseDto[]> {
    const items = await this.itemsService.queryItems(storeId, {
      query,
      menuId,
    });
    return mapToItemDtos(items);
  }
}
