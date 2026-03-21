import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';
import { ItemController } from './items.controller';
import { StoresModule } from '../stores/store.module';
import { CategoriesModule } from '../catalog/category.module';
import { Recipe } from './entities/recipe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, Recipe]),
    StoresModule,
    CategoriesModule,
  ],
  controllers: [ItemController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
