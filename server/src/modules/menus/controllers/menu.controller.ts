import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { CreateMenuDto } from '../dtos/menus/create-menu.dto';
import { UpdateMenuDto } from '../dtos/menus/update-menu.dto';
import { MenuResponseDto } from '../dtos/menus/menu.response.dto';
import { toMenuResponseDto, toMenuResponseDtos } from '../mappers/menu.mapper';

@Controller('stores/:storeId/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async createMenu(
    @Param('storeId') storeId: string,
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.createMenu(storeId, createMenuDto);
    return toMenuResponseDto(menu);
  }

  @Get()
  async getMenusByStore(
    @Param('storeId') storeId: string,
    @Query('includeSections') includeSections?: string,
  ): Promise<MenuResponseDto[]> {
    const menus = await this.menuService.getMenusByStore(
      storeId,
      includeSections === 'true',
    );
    return toMenuResponseDtos(menus);
  }

  @Get(':menuId')
  async getMenuById(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Query('includeSections') includeSections?: string,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.getMenuById(
      storeId,
      menuId,
      includeSections === 'true',
    );
    return toMenuResponseDto(menu);
  }

  @Patch(':menuId')
  async updateMenu(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.updateMenu(
      storeId,
      menuId,
      updateMenuDto,
    );
    return toMenuResponseDto(menu);
  }

  @Patch(':menuId/status')
  async updateMenuStatus(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Body('isActive') isActive: boolean,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.updateMenuStatus(
      storeId,
      menuId,
      isActive,
    );
    return toMenuResponseDto(menu);
  }

  @Delete(':menuId')
  async deleteMenu(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
  ): Promise<void> {
    return this.menuService.deleteMenu(storeId, menuId);
  }
}
