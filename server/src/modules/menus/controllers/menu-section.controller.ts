import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuSectionService } from '../services/menu-section.service';
import { CreateMenuSectionDto } from '../dtos/menu-sections/create-menu-section.dto';
import { UpdateMenuSectionDto } from '../dtos/menu-sections/update-menu-section.dto';
import {
  toMenuSectionResponseDto,
  toMenuSectionResponseDtos,
} from '../mappers/menu-section.mapper';
import { MenuSectionResponseDto } from '../dtos/menu-sections/menu-section.response.dto';

@Controller('stores/:storeId/menus/:menuId/sections')
export class MenuSectionController {
  constructor(private readonly menuSectionService: MenuSectionService) {}

  @Post()
  async create(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Body() createMenuSectionDto: CreateMenuSectionDto,
  ): Promise<MenuSectionResponseDto> {
    const menuSection = await this.menuSectionService.createMenuSection(
      storeId,
      menuId,
      createMenuSectionDto,
    );
    return toMenuSectionResponseDto(menuSection);
  }

  @Get()
  async findAll(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
  ): Promise<MenuSectionResponseDto[]> {
    const menuSections = await this.menuSectionService.getMenuSectionsByMenuId(
      storeId,
      menuId,
    );
    return toMenuSectionResponseDtos(menuSections);
  }

  @Get(':sectionId')
  async findOne(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Param('sectionId') sectionId: string,
  ): Promise<MenuSectionResponseDto> {
    const menuSection = await this.menuSectionService.getMenuSectionById(
      storeId,
      menuId,
      sectionId,
    );
    return toMenuSectionResponseDto(menuSection);
  }

  @Patch(':sectionId')
  async update(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Param('sectionId') sectionId: string,
    @Body() updateMenuSectionDto: UpdateMenuSectionDto,
  ): Promise<MenuSectionResponseDto> {
    const menuSection = await this.menuSectionService.updateMenuSection(
      storeId,
      menuId,
      sectionId,
      updateMenuSectionDto,
    );
    return toMenuSectionResponseDto(menuSection);
  }

  @Delete(':sectionId')
  async remove(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Param('sectionId') sectionId: string,
  ): Promise<void> {
    await this.menuSectionService.deleteMenuSection(storeId, menuId, sectionId);
  }
}
