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
import { MenuSectionService } from '../services/menu-section.service';
import { CreateMenuSectionDto } from '../dtos/menu-sections/create-menu-section.dto';
import { UpdateMenuSectionDto } from '../dtos/menu-sections/update-menu-section.dto';
import {
  toMenuSectionResponseDto,
  toMenuSectionResponseDtos,
} from '../mappers/menu-section.mapper';
import { MenuSectionResponseDto } from '../dtos/menu-sections/menu-section.response.dto';
import { UpdateMenuSectionOrderDto } from '../dtos/menu-sections/update-menu-section-order.dto';

@Controller('stores/:storeId')
export class MenuSectionController {
  constructor(private readonly menuSectionService: MenuSectionService) {}

  @Post('menus/:menuId/sections')
  async create(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Body() createMenuSectionDto: CreateMenuSectionDto,
  ): Promise<MenuSectionResponseDto> {
    const menuSection = await this.menuSectionService.create(
      storeId,
      menuId,
      createMenuSectionDto,
    );
    return toMenuSectionResponseDto(menuSection);
  }

  @Get('menus/:menuId/sections')
  async findAll(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
  ): Promise<MenuSectionResponseDto[]> {
    const menuSections = await this.menuSectionService.findAllByMenu(
      storeId,
      menuId,
    );
    return toMenuSectionResponseDtos(menuSections);
  }

  @Patch('menus/:menuId/sections/order')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOrder(
    @Param('storeId') storeId: string,
    @Param('menuId') menuId: string,
    @Body() updateOrderDto: UpdateMenuSectionOrderDto,
  ): Promise<void> {
    await this.menuSectionService.updateOrder(
      storeId,
      menuId,
      updateOrderDto.sectionIds,
    );
  }

  @Get('menu-sections/:sectionId')
  async findOne(
    @Param('storeId') storeId: string,
    @Param('sectionId') sectionId: string,
  ): Promise<MenuSectionResponseDto> {
    const menuSection = await this.menuSectionService.findOne(
      storeId,
      sectionId,
    );
    return toMenuSectionResponseDto(menuSection);
  }

  @Patch('menu-sections/:sectionId')
  async update(
    @Param('storeId') storeId: string,
    @Param('sectionId') sectionId: string,
    @Body() updateMenuSectionDto: UpdateMenuSectionDto,
  ): Promise<MenuSectionResponseDto> {
    const menuSection = await this.menuSectionService.update(
      storeId,
      sectionId,
      updateMenuSectionDto,
    );
    return toMenuSectionResponseDto(menuSection);
  }

  @Delete('menu-sections/:sectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('storeId') storeId: string,
    @Param('sectionId') sectionId: string,
  ): Promise<void> {
    await this.menuSectionService.remove(storeId, sectionId);
  }
}
