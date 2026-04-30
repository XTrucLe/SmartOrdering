import { Module } from '@nestjs/common';
import { ItemController } from './controllers/item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { OptionGroup } from './entities/option-group.entity';
import { Option } from './entities/option.entity';
import { ItemService } from './services/item.service';
import { OptionGroupController } from './controllers/option-group.controller';
import { OptionGroupService } from './services/option-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item, OptionGroup, Option])],
  controllers: [ItemController, OptionGroupController],
  exports: [ItemService, OptionGroupService],
  providers: [ItemService, OptionGroupService],
})
export class ItemModule {}
