import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { StoresService } from '../services/stores.service';
import { CreateStoreDto } from '../dtos/stores/create-store.dto';
import { UpdateStoreDto } from '../dtos/stores/update-store.dto';
import { isUUID } from 'class-validator';
import { StoreResponseDto } from '../dtos/stores/store.response.dto';
import { mapToStoreDto, mapToStoreDtos } from '../mappers/store.mapper';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/dtos/auth.dto';
import { Pages } from '@/common/interfaces/page.interface';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async createStore(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.createStore(user.sub, dto);
    return mapToStoreDto(store);
  }

  @Get('check-slug/:slug')
  async checkSlug(@Param('slug') slug: string): Promise<{ exists: boolean }> {
    try {
      await this.storesService.getStoreBySlug(slug);
      return { exists: true };
    } catch {
      return { exists: false };
    }
  }

  @Get('my-stores')
  async getMyStores(
    @CurrentUser() user: JwtPayload,
  ): Promise<Pages<StoreResponseDto>> {
    const stores = await this.storesService.getMyStores(user.sub);
    return mapToStoreDtos(stores);
  }

  @Get(':param')
  async getStore(@Param('param') param: string): Promise<StoreResponseDto> {
    const store = isUUID(param)
      ? await this.storesService.getStoreById(param)
      : await this.storesService.getStoreBySlug(param);
    return mapToStoreDto(store);
  }

  @Put(':id')
  async updateStore(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.updateStore(id, dto);
    return mapToStoreDto(store);
  }

  @Delete(':id')
  async deleteStore(@Param('id') id: string): Promise<void> {
    await this.storesService.deleteStore(id);
  }
}
