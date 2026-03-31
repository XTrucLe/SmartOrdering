import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
} from '../dtos/ingredient.dto';
import { handleError } from '@/common/utils/handle-error';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(storeId: string, dto: CreateIngredientDto): Promise<Ingredient> {
    const newIngredient = this.ingredientRepository.create({
      ...dto,
      store: { id: storeId },
    });

    try {
      return await this.ingredientRepository.save(newIngredient);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  async findAll(storeId: string): Promise<Ingredient[]> {
    return this.ingredientRepository.find({
      where: { store: { id: storeId } },
    });
  }

  async findOne(storeId: string, id: string): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({
      where: { id, store: { id: storeId } },
    });
  }

  async findByName(storeId: string, name: string): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({
      where: { name, store: { id: storeId } },
    });
  }

  async getIngredientById(storeId: string, id: string): Promise<Ingredient> {
    const ingredient = await this.findOne(storeId, id);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found.`);
    }
    return ingredient;
  }

  async update(
    storeId: string,
    id: string,
    dto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    const ingredient = await this.getIngredientById(storeId, id);
    Object.assign(ingredient, dto);
    return this.ingredientRepository.save(ingredient);
  }

  async remove(storeId: string, id: string): Promise<void> {
    const ingredient = await this.getIngredientById(storeId, id);
    await this.ingredientRepository.remove(ingredient);
  }

  async toggleActive(storeId: string, id: string): Promise<Ingredient> {
    const ingredient = await this.getIngredientById(storeId, id);
    ingredient.isActive = !ingredient.isActive;
    return this.ingredientRepository.save(ingredient);
  }
}
