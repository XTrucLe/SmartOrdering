import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { CurrentStore } from '../../stores/common/decorators/current-store.decorator';
import { StoreContextDto } from '../../stores/store/dtos/store-context.dto';
import { StoreRoleGuard } from '../../stores/common/guards/store-role.guard';
import { CategoryService } from '../services/category.service';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { CategoryMapper } from '../mappers/category.mapper';
import { StoreManager } from '@/modules/stores/common/decorators/store-role-group.decorator';

@Controller('categories')
@UseGuards(JwtGuard, StoreRoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @StoreManager()
  async createCategory(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.create(store.id, dto);
    return CategoryMapper.toDto(category);
  }

  @Get()
  async getCategories(
    @CurrentStore() store: StoreContextDto,
    @Query('includeProducts') includeProducts?: boolean,
  ): Promise<CategoryResponseDto[]> {
    const categories = includeProducts
      ? await this.categoryService.getAll(store.id)
      : await this.categoryService.getCategories(store.id);
    return CategoryMapper.toDtoList(categories);
  }

  @Get(':id')
  async getCategoryById(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
    @Query('includeProducts') includeProducts?: boolean,
  ): Promise<CategoryResponseDto> {
    const category = includeProducts
      ? await this.categoryService.getCategoryWithProducts(store.id, id)
      : await this.categoryService.getCategoryById(store.id, id);
    return CategoryMapper.toDto(category);
  }

  @Put(':id')
  @StoreManager()
  async updateCategory(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.updateCategory(store.id, id, dto);
    return CategoryMapper.toDto(category);
  }

  @Delete(':id')
  @StoreManager()
  async deleteCategory(@CurrentStore() store: StoreContextDto, @Param('id') id: string) {
    return this.categoryService.deleteCategory(store.id, id);
  }

  @Patch(':id/disable')
  @StoreManager()
  async disableCategory(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.disableCategory(store.id, id);
    return CategoryMapper.toDto(category);
  }

  @Patch(':id/enable')
  @StoreManager()
  async enableCategory(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.enableCategory(store.id, id);
    return CategoryMapper.toDto(category);
  }
}
