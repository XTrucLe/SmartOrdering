import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
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
  async create(
    @Param('storeId') storeId: string,
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.create(storeId, createMenuDto);
    return toMenuResponseDto(menu);
  }

  @Get()
  async findAll(
    @Param('storeId') storeId: string,
    @Query('withRelations') withRelations?: string,
  ): Promise<MenuResponseDto[]> {
    const menus = await this.menuService.findAll(
      storeId,
      withRelations === 'true',
    );
    return toMenuResponseDtos(menus);
  }

  @Get(':menuId')
  async findOne(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Query('withRelations') withRelations?: string,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.findOne(
      storeId,
      menuId,
      withRelations === 'true',
    );
    return toMenuResponseDto(menu);
  }

  @Patch(':menuId')
  async update(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.update(storeId, menuId, updateMenuDto);
    return toMenuResponseDto(menu);
  }

  @Patch(':menuId/status')
  async updateStatus(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Body('isActive') isActive: boolean,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.updateStatus(storeId, menuId, isActive);
    return toMenuResponseDto(menu);
  }

  @Delete(':menuId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
  ): Promise<void> {
    await this.menuService.remove(storeId, menuId);
  }
}
