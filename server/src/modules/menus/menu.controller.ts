import {
  Controller,
  Body,
  Put,
  Post,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dtos/create-menu.dto';
import { UpdateMenuDto } from './dtos/update-menu.dto';
import { MenuResponseDto } from './dtos/menu.response.dto';
import { mapToMenuDto, mapToMenuDtos } from './mappers/menu.mapper';

@Controller('stores/:storeId/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async createMenu(
    @Param('storeId') storeId: string,
    @Body() dto: CreateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.createMenu(storeId, dto);
    return mapToMenuDto(menu);
  }

  @Get()
  async getMenus(
    @Param('storeId') storeId: string,
  ): Promise<MenuResponseDto[]> {
    const menus = await this.menuService.getMenus(storeId);
    return mapToMenuDtos(menus);
  }

  @Get(':id')
  async getMenuById(@Param('id') id: string): Promise<MenuResponseDto> {
    const menu = await this.menuService.getMenuById(id);
    return mapToMenuDto(menu);
  }

  @Put(':id')
  async updateMenu(
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.updateMenu(id, dto);
    return mapToMenuDto(menu);
  }

  @Delete(':id')
  async deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }

  @Put(':id/disable')
  async disableMenu(@Param('id') id: string): Promise<MenuResponseDto> {
    const menu = await this.menuService.disableMenu(id);
    return mapToMenuDto(menu);
  }
}
