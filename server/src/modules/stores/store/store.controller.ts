import { Body, Controller, Param, Post, Put, Delete, Get, UseGuards, Patch } from '@nestjs/common';
import { StoreService } from './store.service';
import { OnboardingService } from '../onboarding/onboarding.service';
import { CreateStoreDto, RegisNewOwnerDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { isUUID } from 'class-validator';
import { StoreResponseDto, StoreShortResponseDto } from './dtos/store.response.dto';
import { mapToStoreDto, mapToStoreDtos } from './store.mapper';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/identity/dtos/auth.dto';
import { Pages } from '@/common/interfaces/page.interface';
import { StoreRoleGuard } from '../common/guards/store-role.guard';
import { JwtGuard } from '../../identity/guards/jwt.guard';
import { StoreManager, StoreOwner } from '../common/decorators/store-role-group.decorator';
import { IsAdmin } from '@/modules/identity/decorators/role.decorator';

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly onboardingService: OnboardingService,
  ) {}

  @Post('regis-owner')
  async createNewOwner(@Body() dto: RegisNewOwnerDto) {
    const { name, email, storeName } = await this.onboardingService.createNewOwner(dto);
    return `Welcome ${name}! Your account with email ${email} has been created, and your store "${storeName}" is ready to use.`;
  }

  @Post()
  @UseGuards(JwtGuard)
  async createStore(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storeService.createStore(user.sub, dto);
    return mapToStoreDto(store);
  }

  @Get('my-stores')
  @UseGuards(JwtGuard)
  async getMyStores(@CurrentUser() user: JwtPayload): Promise<StoreResponseDto[]> {
    const stores = await this.storeService.getMyStores(user.sub);
    return mapToStoreDtos(stores);
  }

  @Get('short')
  @UseGuards(JwtGuard)
  async getMyStoresShort(@CurrentUser() user: JwtPayload): Promise<StoreShortResponseDto[]> {
    const stores = await this.storeService.getListShortStores(user.sub);
    return stores;
  }

  @Get('check-slug/:slug')
  async checkSlug(@Param('slug') slug: string): Promise<{ exists: boolean }> {
    const store = await this.storeService.getStoreBySlug(slug);
    return { exists: !!store };
  }

  @Get(':param')
  async getStore(@Param('param') param: string): Promise<StoreResponseDto> {
    const store = isUUID(param)
      ? await this.storeService.getStoreById(param)
      : await this.storeService.getStoreBySlug(param);
    return mapToStoreDto(store);
  }

  @Put(':id')
  @UseGuards(JwtGuard, StoreRoleGuard)
  @StoreManager()
  async updateStore(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.storeService.updateStore(id, dto);
    return mapToStoreDto(store);
  }

  @Patch(':id/active')
  @UseGuards(JwtGuard)
  @IsAdmin()
  async updateStoreStatus(@Param('id') id: string): Promise<StoreResponseDto> {
    const store = await this.storeService.activeStore(id);
    return mapToStoreDto(store);
  }

  @Patch(':id/inactive')
  @UseGuards(JwtGuard)
  @IsAdmin()
  async updateStoreInactive(@Param('id') id: string): Promise<StoreResponseDto> {
    const store = await this.storeService.rejectStore(id);
    return mapToStoreDto(store);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, StoreRoleGuard)
  @StoreOwner()
  async deleteStore(@Param('id') id: string): Promise<void> {
    await this.storeService.deleteStore(id);
  }
}
