import { Body, Controller, Param, Post, Put, Delete, Get, UseGuards } from '@nestjs/common';
import { StoresService } from '../services/stores.service';
import { CreateStoreDto } from '../dtos/stores/create-store.dto';
import { UpdateStoreDto } from '../dtos/stores/update-store.dto';
import { isUUID } from 'class-validator';
import { StoreResponseDto } from '../dtos/stores/store.response.dto';
import { mapToStoreDto, mapToStoreDtos } from '../mappers/store.mapper';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/identity/dtos/auth.dto';
import { Pages } from '@/common/interfaces/page.interface';
import { StoreRoleGuard } from '../guards/store-role.guard';
import { JwtGuard } from '../../identity/guards/jwt.guard';
import { CurrentStore } from '../decorators/current-store.decorator';
import { StoreInfo } from '../dtos/stores/store-info.dto';
import { StoreManager, StoreOwner } from '../decorators/store-role-group.decorator';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createStore(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.createStore(user.sub, dto);
    return mapToStoreDto(store);
  }

  @Get('my-stores')
  @UseGuards(JwtGuard)
  async getMyStores(@CurrentUser() user: JwtPayload): Promise<Pages<StoreResponseDto>> {
    const stores = await this.storesService.getMyStores(user.sub);
    return mapToStoreDtos(stores);
  }

  @Get('check-slug/:slug')
  async checkSlug(@Param('slug') slug: string): Promise<{ exists: boolean }> {
    const store = await this.storesService.getStoreBySlug(slug);
    return { exists: !!store };
  }

  @Get(':param')
  async getStore(@Param('param') param: string): Promise<StoreResponseDto> {
    const store = isUUID(param)
      ? await this.storesService.getStoreById(param)
      : await this.storesService.getStoreBySlug(param);
    return mapToStoreDto(store);
  }

  @Put(':id')
  @UseGuards(JwtGuard, StoreRoleGuard)
  @StoreManager()
  async updateStore(
    @CurrentStore() storeInfo: StoreInfo,
    @Body() dto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.updateStore(storeInfo.id, dto);
    return mapToStoreDto(store);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, StoreRoleGuard)
  @StoreOwner()
  async deleteStore(@CurrentStore() storeInfo: StoreInfo): Promise<void> {
    await this.storesService.deleteStore(storeInfo.id);
  }
}
