import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Section } from './entities/section.entity';
import { SectionItem } from './entities/section-item.entity';
import { MenuController } from './controllers/menu.controller';
import { SectionController } from './controllers/section.controller';
import { SectionItemController } from './controllers/section-item.controller';
import { MenuService } from './services/menu.service';
import { SectionService } from './services/section.service';
import { SectionItemService } from './services/section-item.service';
import { StoresModule } from '../stores/store.module';
import { ItemModule } from '../items/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Section, SectionItem]), StoresModule, ItemModule],
  controllers: [MenuController, SectionController, SectionItemController],
  providers: [MenuService, SectionService, SectionItemService],
  exports: [MenuService, SectionService, SectionItemService],
})
export class MenuModule {}
