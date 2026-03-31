import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Delete,
  Get,
  UseGuards,
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
import { StoreRoleGuard } from '../guards/store-role.guard';
import { JwtGuard } from './../../auth/guards/jwt.guard';
import { StoreRoles } from '../decorators/store-role.decorator';
import { StoreRole } from '../constants/store-role.constant';
import { CurrentStore } from '../decorators/current-store.decorator';
import { StoreInfo } from '../dtos/stores/store-info.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createStore(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.createStore(user.sub, dto);
    return mapToStoreDto(store);
  }

  @UseGuards(JwtGuard)
  @Get('my-stores')
  async getMyStores(
    @CurrentUser() user: JwtPayload,
  ): Promise<Pages<StoreResponseDto>> {
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

  @UseGuards(JwtGuard, StoreRoleGuard)
  @StoreRoles(StoreRole.OWNER, StoreRole.MANAGER)
  @Put(':id')
  async updateStore(
    @CurrentStore() storeInfo: StoreInfo,
    @Body() dto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storesService.updateStore(storeInfo.id, dto);
    return mapToStoreDto(store);
  }

  @UseGuards(JwtGuard, StoreRoleGuard)
  @StoreRoles(StoreRole.OWNER)
  @Delete(':id')
  async deleteStore(@CurrentStore() storeInfo: StoreInfo): Promise<void> {
    await this.storesService.deleteStore(storeInfo.id);
  }
}
