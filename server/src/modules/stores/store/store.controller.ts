import { Body, Controller, Param, Post, Put, Delete, Get, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { isUUID } from 'class-validator';
import { StoreResponseDto } from './dtos/store.response.dto';
import { mapToStoreDto, mapToStoreDtos } from './store.mapper';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/identity/dtos/auth.dto';
import { Pages } from '@/common/interfaces/page.interface';
import { StoreRoleGuard } from '../common/guards/store-role.guard';
import { JwtGuard } from '../../identity/guards/jwt.guard';
import { CurrentStore } from '../common/decorators/current-store.decorator';
import { StoreContextDto } from './dtos/store-context.dto';
import { StoreManager, StoreOwner } from '../common/decorators/store-role-group.decorator';

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
    @CurrentStore() StoreContextDto: StoreContextDto,
    @Body() dto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.updateStore(StoreContextDto.id, dto);
    return mapToStoreDto(store);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, StoreRoleGuard)
  @StoreOwner()
  async deleteStore(@CurrentStore() StoreContextDto: StoreContextDto): Promise<void> {
    await this.storesService.deleteStore(StoreContextDto.id);
  }
}
