import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { Store } from './entities/store.entity';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { isUUID } from 'class-validator';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}
  @Post()
  async createStore(@Body() dto: CreateStoreDto): Promise<Store> {
    return this.storesService.createStore(dto);
  }
  @Get(':param')
  async getStore(@Param('param') param: string): Promise<Store> {
    if (isUUID(param)) {
      return this.storesService.getStoreById(param);
    } else {
      return this.storesService.getStoreBySlug(param);
    }
  }
  @Put(':id')
  async updateStore(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storesService.updateStore(id, updateStoreDto);
  }
  @Delete(':id')
  async deleteStore(@Param('id') id: string): Promise<void> {
    return this.storesService.deleteStore(id);
  }
}
