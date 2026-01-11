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
import { UpdateStoreDto } from './dtos/update-store.dto';
import { isUUID } from 'class-validator';
import { StoreResponseDto } from './dtos/store.response.dto';
import { mapToStoreDto } from './mappers/store.mapper';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}
  @Post()
  async createStore(@Body() dto: CreateStoreDto): Promise<StoreResponseDto> {
    const store = await this.storesService.createStore(dto);
    return mapToStoreDto(store);
  }
  @Get(':param')
  async getStore(@Param('param') param: string): Promise<StoreResponseDto> {
    if (isUUID(param)) {
      const store = await this.storesService.getStoreById(param);
      return mapToStoreDto(store);
    } else {
      const store = await this.storesService.getStoreBySlug(param);
      return mapToStoreDto(store);
    }
  }
  @Put(':id')
  async updateStore(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.updateStore(id, updateStoreDto);
    return mapToStoreDto(store);
  }
  @Delete(':id')
  async deleteStore(@Param('id') id: string): Promise<void> {
    return this.storesService.deleteStore(id);
  }
}
