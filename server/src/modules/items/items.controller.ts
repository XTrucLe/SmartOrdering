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

@Controller('stores/:storeId/items')
export class ItemController {
  constructor(private readonly itemsService: ItemsService) {}
  @Post()
  async createItem(
    @Param('storeId') storeId: string,
    @Body() dto: CreateItemDto,
  ) {
    return this.itemsService.createItem(storeId, dto);
  }
  @Get(':id')
  async getItemById(@Param('id') id: string) {
    return this.itemsService.getItemById(id);
  }

  @Put(':id')
  async updateItem(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.updateItem(id, dto);
  }
  @Put(':id/change-status')
  async changeItemStatus(
    @Param('id') id: string,
    @Body('status') status: ItemStatus,
  ) {
    return this.itemsService.toggleItemStatus(id, status);
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
  ) {
    return this.itemsService.queryItems(storeId, { query, menuId });
  }
}
