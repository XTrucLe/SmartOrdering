import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { CategoriesModule } from '../categories/category.module';
import { ItemsModule } from '../items/items.module';
import { MenuSection } from './entities/menu-section.entity';
import { MenuItem } from './entities/menu-item.entity';
import { MenuController } from './controllers/menu.controller';
import { MenuSectionController } from './controllers/menu-section.controller';
import { MenuItemController } from './controllers/menu-item.controller';
import { MenuService } from './services/menu.service';
import { MenuSectionService } from './services/menu-section.service';
import { MenuItemService } from './services/menu-item.service';
import { StoresModule } from '../stores/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, MenuSection, MenuItem]),
    CategoriesModule,
    ItemsModule,
    StoresModule,
  ],
  controllers: [MenuController, MenuSectionController, MenuItemController],
  providers: [MenuService, MenuSectionService, MenuItemService],
  exports: [MenuService, MenuSectionService, MenuItemService],
})
export class MenusModule {}
