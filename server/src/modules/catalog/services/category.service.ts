import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { handleError } from '@/common/utils/handle-error';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(storeId: string, dto: CreateCategoryDto): Promise<Category> {
    const { name } = dto;

    const existingCategory = await this.categoryRepository.findOne({
      where: { name, store: { id: storeId } },
    });

    if (existingCategory) {
      throw new ConflictException(`Category with name ${name} already exists.`);
    }

    const newCategory = this.categoryRepository.create({
      ...dto,
      store: { id: storeId },
    });

    try {
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      return handleError(error);
    }
  }

  async getCategories(storeId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { store: { id: storeId } },
      relations: ['items'],
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
      where: { id, store: { id: storeId } },
      relations: ['items'],
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
    const category = await this.getCategoryById(storeId, id);
    category.isActive = false;
    return this.categoryRepository.save(category);
  }
}
