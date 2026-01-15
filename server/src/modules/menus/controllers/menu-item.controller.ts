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
} from '@nestjs/common';
import { MenuItemService } from '../services/menu-item.service';
import { CreateMenuItemDto } from '../dtos/menu-items/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dtos/menu-items/update-menu-item.dto';
import { MenuItemResponseDto } from '../dtos/menu-items/menu-item.response.dto';
import {
  toMenuItemResponseDto,
  toMenuItemResponseDtos,
} from '../mappers/menu-item.mapper';
import { UpdateMenuItemOrderDto } from '../dtos/menu-items/update-menu-item-order.dto';

@Controller('stores/:storeId')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post('menu-sections/:sectionId/items')
  async create(
    @Param('storeId') storeId: string,
    @Param('sectionId') sectionId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemService.create(
      storeId,
      sectionId,
      createMenuItemDto,
    );
    return toMenuItemResponseDto(menuItem);
  }

  @Get('menu-sections/:sectionId/items')
  async findAll(
    @Param('storeId') storeId: string,
    @Param('sectionId') sectionId: string,
  ): Promise<MenuItemResponseDto[]> {
    const menuItems = await this.menuItemService.findAllBySection(
      storeId,
      sectionId,
    );
    return toMenuItemResponseDtos(menuItems);
  }

  @Patch('menu-sections/:sectionId/items/order')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOrder(
    @Param('storeId') storeId: string,
    @Param('sectionId') sectionId: string,
    @Body() updateOrderDto: UpdateMenuItemOrderDto,
  ): Promise<void> {
    await this.menuItemService.updateOrder(
      storeId,
      sectionId,
      updateOrderDto.itemIds,
    );
  }

  @Get('menu-items/:itemId')
  async findOne(
    @Param('storeId') storeId: string,
    @Param('itemId') itemId: string,
  ): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemService.findOne(storeId, itemId);
    return toMenuItemResponseDto(menuItem);
  }

  @Patch('menu-items/:itemId')
  async update(
    @Param('storeId') storeId: string,
    @Param('itemId') itemId: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemService.update(
      storeId,
      itemId,
      updateMenuItemDto,
    );
    return toMenuItemResponseDto(menuItem);
  }

  @Delete('menu-items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('storeId') storeId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    await this.menuItemService.remove(storeId, itemId);
  }
}
