import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { StoresModule } from '../stores/store.module';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), StoresModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenusModule {}
