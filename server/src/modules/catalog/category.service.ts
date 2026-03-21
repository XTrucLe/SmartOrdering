import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryStatus } from './constants/category.constant';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    storeId: string,
    dto: CreateCategoryDto,
  ): Promise<Category> {
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
      status: dto.status ?? CategoryStatus.ACTIVE,
    });
    return this.categoryRepository.save(newCategory);
  }

  async getCategorys(storeId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { store: { id: storeId } },
      relations: ['items'],
    });
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getCategoryById(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategoryById(id);
    await this.categoryRepository.remove(category);
  }

  async disableCategory(id: string): Promise<Category> {
    const category = await this.getCategoryById(id);
    category.status = CategoryStatus.INACTIVE;
    return this.categoryRepository.save(category);
  }
}
