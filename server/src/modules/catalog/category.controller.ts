import {
  Controller,
  Body,
  Put,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryResponseDto } from './dtos/category.response.dto';
import { mapToCategoryDto, mapToCategoryDtos } from './mappers/category.mapper';
import { StoreGuard } from '../stores/guards/store.guard';

@Controller('stores/:storeId/categories')
@UseGuards(StoreGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Param('storeId') storeId: string,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.createCategory(storeId, dto);
    return mapToCategoryDto(category);
  }

  @Get()
  async getCategorys(
    @Param('storeId') storeId: string,
  ): Promise<CategoryResponseDto[]> {
    const categorys = await this.categoryService.getCategorys(storeId);
    return mapToCategoryDtos(categorys);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryService.getCategoryById(id);
    return mapToCategoryDto(category);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.updateCategory(id, dto);
    return mapToCategoryDto(category);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Put(':id/disable')
  async disableCategory(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryService.disableCategory(id);
    return mapToCategoryDto(category);
  }
}
