import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MenuItemService } from '../services/menu-item.service';
import { CreateMenuItemDto } from '../dtos/menu-items/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dtos/menu-items/update-menu-item.dto';
import { MenuItemResponseDto } from '../dtos/menu-items/menu-item.response.dto';
import {
  toMenuItemResponseDto,
  toMenuItemResponseDtos,
} from '../mappers/menu-item.mapper';

@Controller('stores/:storeId/menus/:menuId/sections/:menuSectionId/items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  async createMenuItem(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Param('menuSectionId') menuSectionId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemService.createMenuItem(
      storeId,
      menuId,
      menuSectionId,
      createMenuItemDto,
    );

    return toMenuItemResponseDto(menuItem);
  }

  @Get()
  async getMenuItemsByMenuSectionId(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Param('menuSectionId') menuSectionId: string,
  ): Promise<MenuItemResponseDto[]> {
    const menuItems = await this.menuItemService.getMenuItemsByMenuSectionId(
      storeId,
      menuId,
      menuSectionId,
    );

    return toMenuItemResponseDtos(menuItems);
  }

  @Get(':menuItemId')
  async getMenuItemById(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Param('menuSectionId') menuSectionId: string,
    @Param('menuItemId') menuItemId: string,
  ): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemService.getMenuItemById(
      storeId,
      menuId,
      menuSectionId,
      menuItemId,
    );

    return toMenuItemResponseDto(menuItem);
  }

  @Patch(':menuItemId')
  async updateMenuItem(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Param('menuSectionId') menuSectionId: string,
    @Param('menuItemId') menuItemId: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const menuItem = await this.menuItemService.updateMenuItem(
      storeId,
      menuId,
      menuSectionId,
      menuItemId,
      updateMenuItemDto,
    );

    return toMenuItemResponseDto(menuItem);
  }

  @Delete(':menuItemId')
  async deleteMenuItem(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Param('menuSectionId') menuSectionId: string,
    @Param('menuItemId') menuItemId: string,
  ): Promise<void> {
    await this.menuItemService.deleteMenuItem(
      storeId,
      menuId,
      menuSectionId,
      menuItemId,
    );
  }
}
