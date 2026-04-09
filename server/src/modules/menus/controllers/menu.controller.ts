import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { CreateMenuDto } from '../dtos/menus/create-menu.dto';
import { UpdateMenuDto } from '../dtos/menus/update-menu.dto';
import { MenuResponseDto } from '../dtos/menus/menu.response.dto';
import { MenuMapper } from '../mappers/menu.mapper';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '@/modules/stores/guards/store-role.guard';
import { StoreManager } from '@/modules/stores/decorators/store-role-group.decorator';
import { CurrentStore } from '@/modules/stores/decorators/current-store.decorator';
import { StoreInfo } from '@/modules/stores/dtos/stores/store-info.dto';

@Controller('menus')
@UseGuards(JwtGuard, StoreRoleGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @StoreManager()
  async create(
    @CurrentStore() store: StoreInfo,
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.create(store.id, createMenuDto);
    return MenuMapper.toResponseDto(menu);
  }

  @Get()
  async findAll(@CurrentStore() store: StoreInfo): Promise<MenuResponseDto[]> {
    const menus = await this.menuService.findAll(store.id);
    return MenuMapper.toResponseDtoList(menus);
  }

  @Get(':menuId')
  async findOne(
    @CurrentStore() store: StoreInfo,
    @Param('menuId') menuId: string,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.findOne(store.id, menuId);
    return MenuMapper.toResponseDto(menu);
  }

  @Patch(':menuId')
  @StoreManager()
  async update(
    @CurrentStore() store: StoreInfo,
    @Param('menuId') menuId: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.update(store.id, menuId, updateMenuDto);
    return MenuMapper.toResponseDto(menu);
  }

  @Patch(':menuId/activate')
  @StoreManager()
  async activateMenu(
    @CurrentStore() store: StoreInfo,
    @Param('menuId') menuId: string,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.activate(store.id, menuId);
    return MenuMapper.toResponseDto(menu);
  }

  @Patch(':menuId/deactivate')
  @StoreManager()
  async deactivateMenu(
    @CurrentStore() store: StoreInfo,
    @Param('menuId') menuId: string,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuService.deactivate(store.id, menuId);
    return MenuMapper.toResponseDto(menu);
  }

  @Delete(':menuId')
  @StoreManager()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentStore() store: StoreInfo, @Param('menuId') menuId: string): Promise<void> {
    await this.menuService.remove(store.id, menuId);
  }
}
