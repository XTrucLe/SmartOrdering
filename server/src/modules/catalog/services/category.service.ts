import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { handleError } from '@/common/utils/handle-error';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(storeId: string, dto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: dto.name, storeId },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name ${dto.name} already exists.`,
      );
    }

    const newCategory = this.categoryRepository.create({
      ...dto,
      storeId,
      displayOrder: await this.getDisplayOrder(storeId),
    });

    try {
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      return handleError(error);
    }
  }

  async getCategories(storeId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { storeId },
      order: { displayOrder: 'ASC' },
    });
  }

  async getCategoryById(storeId: string, id: string): Promise<Category> {
    const category = await this.findCategory(storeId, id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async findCategory(storeId: string, id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id, storeId },
    });
  }

  async getCategoryWithProducts(
    storeId: string,
    categoryId: string,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, storeId },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    return category;
  }

  async getAll(storeId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { storeId },
      order: { displayOrder: 'ASC' },
      relations: ['products'],
    });
  }

  async updateCategory(
    storeId: string,
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryById(storeId, id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(storeId: string, id: string): Promise<void> {
    const category = await this.getCategoryById(storeId, id);
    await this.categoryRepository.remove(category);
  }

  async disableCategory(storeId: string, id: string): Promise<Category> {
    return this.toggleActive(storeId, id, 'disable');
  }

  async enableCategory(storeId: string, id: string): Promise<Category> {
    return this.toggleActive(storeId, id, 'enable');
  }

  private async toggleActive(
    storeId: string,
    id: string,
    action: 'enable' | 'disable',
  ): Promise<Category> {
    const category = await this.getCategoryById(storeId, id);
    if (action === 'disable' && !category.isActive) {
      throw new ConflictException(
        `Category with ID ${id} is already disabled.`,
      );
    }

    if (action === 'enable' && category.isActive) {
      throw new ConflictException(`Category with ID ${id} is already enabled.`);
    }

    category.isActive = !category.isActive;
    return this.categoryRepository.save(category);
  }

  private async getDisplayOrder(storeId: string): Promise<number> {
    const maxOrder =
      (await this.categoryRepository.count({
        where: { storeId },
      })) ?? 0;
    return maxOrder + 1;
  }
}
