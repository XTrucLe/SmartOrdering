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

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}
  @Post()
  async createStore(@Body() dto: CreateStoreDto): Promise<Store> {
    return this.storesService.createStore(dto);
  }
  @Get('/:slug')
  async getStoreBySlug(@Param('slug') slug: string): Promise<Store> {
    return this.storesService.getStoreBySlug(slug);
  }
  @Get(':id')
  async getStoreById(@Param('id') id: string): Promise<Store> {
    return this.storesService.getStoreById(id);
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
