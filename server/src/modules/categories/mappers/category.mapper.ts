import { plainToInstance } from 'class-transformer';
import { Category } from '../entities/category.entity';
import { CategoryResponseDto } from '../dtos/category.response.dto';

export function mapToCategoryDto(category: Category): CategoryResponseDto {
  return plainToInstance(CategoryResponseDto, category, {
    excludeExtraneousValues: true,
  });
}

export function mapToCategoryDtos(
  categories: Category[],
): CategoryResponseDto[] {
  return categories.map((category) =>
    plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    }),
  );
}
