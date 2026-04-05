import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from '../stores/store.module';
import { CategoryController } from './controllers/category.controller';
import { ComboController } from './controllers/combo.controller';
import { ProductController } from './controllers/product.controller';
import { Category } from './entities/category.entity';
import { Combo } from './entities/combo.entity';
import { ComboItem } from './entities/combo-item.entity';
import { Product } from './entities/product.entity';
import { Tag } from './entities/tag.entity';
import { CategoryService } from './services/category.service';
import { ComboService } from './services/combo.service';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    StoresModule,
    TypeOrmModule.forFeature([Category, Combo, ComboItem, Product, Tag]),
  ],
  controllers: [CategoryController, ComboController, ProductController],
  providers: [CategoryService, ComboService, ProductService],
  exports: [CategoryService, ComboService, ProductService],
})
export class CatalogModule {}
