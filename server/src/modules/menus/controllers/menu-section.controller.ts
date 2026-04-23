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
  UseGuards,
} from '@nestjs/common';
import { MenuSectionService } from '../services/menu-section.service';
import { CreateMenuSectionDto } from '../dtos/menu-sections/create-menu-section.dto';
import { UpdateMenuSectionDto } from '../dtos/menu-sections/update-menu-section.dto';
import { MenuSectionMapper } from '../mappers/menu-section.mapper';
import { MenuSectionResponseDto } from '../dtos/menu-sections/menu-section.response.dto';
import { UpdateMenuSectionOrderDto } from '../dtos/menu-sections/update-menu-section-order.dto';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '@/modules/stores/common/guards/store-role.guard';
import { CurrentStore } from '@/modules/stores/common/decorators/current-store.decorator';
import { StoreContextDto } from '@/modules/stores/store/dtos/store-context.dto';

@Controller()
@UseGuards(JwtGuard, StoreRoleGuard)
export class MenuSectionController {
  constructor(private readonly service: MenuSectionService) {}

  @Post('menus/:menuId/menu-sections')
  async create(
    @CurrentStore() store: StoreContextDto,
    @Param('menuId') menuId: string,
    @Body() dto: CreateMenuSectionDto,
  ): Promise<MenuSectionResponseDto> {
    const section = await this.service.create(store.id, menuId, dto);
    return MenuSectionMapper.toResponseDto(section);
  }

  @Get('menus/:menuId/menu-sections')
  async findAll(
    @CurrentStore() store: StoreContextDto,
    @Param('menuId') menuId: string,
  ): Promise<MenuSectionResponseDto[]> {
    const sections = await this.service.findAllByMenu(store.id, menuId);
    return MenuSectionMapper.toResponseDtoList(sections);
  }

  @Patch('menus/:menuId/menu-sections/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reorder(
    @CurrentStore() store: StoreContextDto,
    @Param('menuId') menuId: string,
    @Body() dto: UpdateMenuSectionOrderDto,
  ): Promise<void> {
    await this.service.updateOrder(store.id, menuId, dto.sectionIds);
  }

  @Get('menu-sections/:sectionId')
  async findOne(
    @CurrentStore() store: StoreContextDto,
    @Param('sectionId') sectionId: string,
  ): Promise<MenuSectionResponseDto> {
    const section = await this.service.findOne(store.id, sectionId);
    return MenuSectionMapper.toResponseDto(section);
  }

  @Patch('menu-sections/:sectionId')
  async update(
    @CurrentStore() store: StoreContextDto,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateMenuSectionDto,
  ): Promise<MenuSectionResponseDto> {
    const section = await this.service.update(store.id, sectionId, dto);
    return MenuSectionMapper.toResponseDto(section);
  }

  @Delete('menu-sections/:sectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentStore() store: StoreContextDto,
    @Param('sectionId') sectionId: string,
  ): Promise<void> {
    await this.service.remove(store.id, sectionId);
  }
}
