import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { StoresModule } from '../stores/store.module';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientController } from './controllers/ingredient.controller';
import { IngredientService } from './services/ingredient.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Ingredient]), StoresModule],
  controllers: [CategoryController, IngredientController],
  providers: [CategoryService, IngredientService],
  exports: [CategoryService, IngredientService],
})
export class CatalogModule {}
