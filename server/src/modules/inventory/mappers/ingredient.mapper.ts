import { plainToInstance } from 'class-transformer';
import { Ingredient } from '../../inventory/entities/ingredient.entity';
import { IngredientResponseDto } from '../dtos/ingredient.dto';

export class IngredientMapper {
  static toDto(ingredient: Ingredient): IngredientResponseDto {
    return plainToInstance(IngredientResponseDto, ingredient, {
      excludeExtraneousValues: true,
    });
  }

  static toList(ingredients: Ingredient[]): IngredientResponseDto[] {
    if (!ingredients || !Array.isArray(ingredients)) return [];
    return ingredients.map((ingredient) => this.toDto(ingredient));
  }
}
