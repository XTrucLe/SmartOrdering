import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { StoreConfigService } from './config.service';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '../common/guards/store-role.guard';
import { StoreManager } from '../common/decorators/store-role-group.decorator';
import { CurrentStore } from '../common/decorators/current-store.decorator';
import { StoreContextDto } from '../store/dtos/store-context.dto';
import { CreateStoreConfigDto, StoreConfigResponseDto } from './config.dto';

@Controller('stores/config')
@UseGuards(JwtGuard, StoreRoleGuard)
export class StoreConfigController {
  constructor(private readonly configService: StoreConfigService) {}

  @Get()
  async getStoreConfig(@CurrentStore() store: StoreContextDto): Promise<StoreConfigResponseDto> {
    const config = await this.configService.getConfig(store.id);
    return config;
  }

  @Put()
  @StoreManager()
  async upsertStoreConfig(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateStoreConfigDto,
  ): Promise<StoreConfigResponseDto> {
    const config = await this.configService.createOrUpdate(store.id, dto);
    return config;
  }

  @Patch()
  @StoreManager()
  async updateStoreConfig(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateStoreConfigDto,
  ): Promise<StoreConfigResponseDto> {
    const config = await this.configService.update(store.id, dto);
    return config;
  }
}
