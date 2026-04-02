import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm';
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
    const existingIngredient = await this.findByName(storeId, dto.name);

    if (existingIngredient) {
      throw new ConflictException(
        `Ingredient with name ${dto.name} already exists.`,
      );
    }

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

  async findByCode(storeId: string, code: string): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({
      where: { code, store: { id: storeId } },
    });
  }

  async getIngredientById(storeId: string, id: string): Promise<Ingredient> {
    const ingredient = await this.findOne(storeId, id);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found.`);
    }
    return ingredient;
  }

  async getListIngredientsByIds(
    storeId: string,
    ids: string[],
  ): Promise<Ingredient[]> {
    if (!ids.length) return [];

    const uniqueIds = [...new Set(ids)];

    if (uniqueIds.length > 50) {
      throw new ConflictException('Too many ingredient Ids provided.');
    }

    const ingredients = await this.ingredientRepository.find({
      where: {
        storeId,
        id: In(uniqueIds),
      },
    });

    if (ingredients.length !== uniqueIds.length) {
      const foundSet = new Set(ingredients.map((ing) => ing.id));
      const notFoundIds = uniqueIds.filter((id) => !foundSet.has(id));

      throw new NotFoundException(
        `Ingredients with IDs ${notFoundIds.join(
          ', ',
        )} not found in store ${storeId}.`,
      );
    }

    return ingredients;
  }

  async getIngredientByCode(
    storeId: string,
    code: string,
  ): Promise<Ingredient> {
    const ingredient = await this.findByCode(storeId, code);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with code ${code} not found.`);
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

  async adjustStock(
    storeId: string,
    id: string,
    quantity: number,
    manager?: EntityManager,
  ): Promise<Ingredient> {
    const repo = manager
      ? manager.getRepository(Ingredient)
      : this.ingredientRepository;
    const ingredient = await repo.findOne({
      where: { id, store: { id: storeId } },
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found.`);
    }

    const newStock =
      parseFloat(ingredient.stockQty) +
      quantity * parseFloat(ingredient.conversionRate);

    ingredient.stockQty = newStock.toString();

    return repo.save(ingredient);
  }
}
