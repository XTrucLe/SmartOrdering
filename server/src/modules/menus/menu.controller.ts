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

@Controller('stores/:storeId/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post()
  async createMenu(
    @Param('storeId') storeId: string,
    @Body() dto: CreateMenuDto,
  ) {
    return this.menuService.createMenu(storeId, dto);
  }

  @Get()
  async getMenus(@Param('storeId') storeId: string) {
    return this.menuService.getMenus(storeId);
  }
  @Put(':id')
  async updateMenu(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menuService.updateMenu(id, dto);
  }
  @Delete(':id')
  async deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }
  @Put(':id/disable')
  async disableMenu(@Param('id') id: string) {
    return this.menuService.disableMenu(id);
  }
}
