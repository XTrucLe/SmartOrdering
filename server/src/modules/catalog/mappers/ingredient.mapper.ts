import { plainToInstance } from 'class-transformer';
import { Ingredient } from '../entities/ingredient.entity';
import { IngredientResponseDto } from '../dtos/ingredient.dto';

export const mapToIngredientResponseDto = (
  ingredient: Ingredient,
): IngredientResponseDto => {
  return plainToInstance(IngredientResponseDto, ingredient, {
    excludeExtraneousValues: true,
  });
};

export const mapToIngredientResponseDtos = (
  ingredients: Ingredient[],
): IngredientResponseDto[] => {
  return ingredients.map((ingredient) =>
    plainToInstance(IngredientResponseDto, ingredient, {
      excludeExtraneousValues: true,
    }),
  );
};
