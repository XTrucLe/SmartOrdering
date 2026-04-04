import { plainToInstance } from 'class-transformer';
import { Category } from '../entities/category.entity';
import { CategoryResponseDto } from '../dtos/category.dto';

export class CategoryMapper {
  static toDto(category: Category): CategoryResponseDto {
    return plainToInstance(CategoryResponseDto, category, { excludeExtraneousValues: true });
  }

  static toDtoList(categories: Category[]): CategoryResponseDto[] {
    return categories.map(category => this.toDto(category));
  }
}