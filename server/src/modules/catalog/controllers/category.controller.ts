import {
  Controller,
  Body,
  Put,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryResponseDto } from '../dtos/category.response.dto';
import {
  mapToCategoryDto,
  mapToCategoryDtos,
} from '../mappers/category.mapper';
import { StoreRoleGuard } from '../../stores/guards/store-role.guard';
import { JwtGuard } from '@/modules/auth/guards/jwt.guard';
import { CurrentStore } from '../../stores/decorators/current-store.decorator';
import { StoreInfo } from '../../stores/dtos/stores/store-info.dto';

@Controller('categories')
@UseGuards(JwtGuard, StoreRoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @CurrentStore() store: StoreInfo,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.create(store.id, dto);
    return mapToCategoryDto(category);
  }

  @Get()
  async getCategories(
    @CurrentStore() store: StoreInfo,
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryService.getCategories(store.id);
    return mapToCategoryDtos(categories);
  }

  @Get(':id')
  async getCategoryById(
    @CurrentStore() store: StoreInfo,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.getCategoryById(store.id, id);
    return mapToCategoryDto(category);
  }

  @Put(':id')
  async updateCategory(
    @CurrentStore() store: StoreInfo,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.updateCategory(
      store.id,
      id,
      dto,
    );
    return mapToCategoryDto(category);
  }

  @Delete(':id')
  async deleteCategory(
    @CurrentStore() store: StoreInfo,
    @Param('id') id: string,
  ) {
    return this.categoryService.deleteCategory(store.id, id);
  }

  @Patch(':id/disable')
  async disableCategory(
    @CurrentStore() store: StoreInfo,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.disableCategory(store.id, id);
    return mapToCategoryDto(category);
  }
}
