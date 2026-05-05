import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ZonesService } from '../zone/zone.service';
import { CreateZoneDto, UpdateZoneDto, ZoneResponseDto } from './dtos/zone.dto';
import { Zone } from './zone.entity';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '../common/guards/store-role.guard';
import { StoreManager } from '../common/decorators/store-role-group.decorator';
import { CurrentStore } from '../common/decorators/current-store.decorator';
import { StoreContextDto } from '../store/dtos/store-context.dto';
import { ZoneMapper } from './zone.mapper';

@Controller('/zones')
@UseGuards(JwtGuard, StoreRoleGuard)
export class ZoneController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @StoreManager()
  async createZone(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateZoneDto,
  ): Promise<ZoneResponseDto> {
    const zone = await this.zonesService.createZone(store.id, dto);
    return ZoneMapper.toDto(zone);
  }

  @Get()
  async getZonesInStore(@CurrentStore('id') storeId: string): Promise<ZoneResponseDto[]> {
    const zones = await this.zonesService.getZonesInStore(storeId);
    return ZoneMapper.toDtos(zones);
  }

  @Get(':zoneId')
  async getZoneById(
    @CurrentStore('id') storeId: string,
    @Param('zoneId') zoneId: string,
  ): Promise<ZoneResponseDto> {
    const zone = await this.zonesService.getZoneById(storeId, zoneId);
    return ZoneMapper.toDto(zone);
  }

  @Patch(':zoneId')
  @StoreManager()
  async updateZone(
    @CurrentStore('id') storeId: string,
    @Param('zoneId') zoneId: string,
    @Body() dto: UpdateZoneDto,
  ): Promise<ZoneResponseDto> {
    const zone = await this.zonesService.updateZone(storeId, zoneId, dto);
    return ZoneMapper.toDto(zone);
  }

  @Put('reorder')
  @StoreManager()
  async reorderZones(
    @CurrentStore('id') storeId: string,
    @Body('orderedIds') orderedIds: string[],
  ): Promise<ZoneResponseDto[]> {
    const zones = await this.zonesService.reorderZones(storeId, orderedIds);
    return ZoneMapper.toDtos(zones);
  }

  @Delete(':zoneId')
  @StoreManager()
  async deleteZone(
    @CurrentStore('id') storeId: string,
    @Param('zoneId') zoneId: string,
  ): Promise<void> {
    return this.zonesService.deleteZone(storeId, zoneId);
  }
}
