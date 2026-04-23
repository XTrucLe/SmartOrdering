import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ZonesService } from '../zone/zone.service';
import { CreateZoneDto, UpdateZoneDto } from './dtos/zone.dto';
import { Zone } from './zone.entity';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '../common/guards/store-role.guard';
import { StoreManager } from '../common/decorators/store-role-group.decorator';
import { CurrentStore } from '../common/decorators/current-store.decorator';
import { StoreContextDto } from '../store/dtos/store-context.dto';

@Controller('/zones')
@UseGuards(JwtGuard, StoreRoleGuard)
export class ZoneController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @StoreManager()
  async createZone(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateZoneDto,
  ): Promise<Zone> {
    return this.zonesService.createZone(store.id, dto);
  }

  @Get()
  async getZonesInStore(@CurrentStore() store: StoreContextDto): Promise<Zone[]> {
    return this.zonesService.getZonesInStore(store.id);
  }

  @Get(':zoneId')
  async getZoneById(
    @CurrentStore() store: StoreContextDto,
    @Param('zoneId') zoneId: string,
  ): Promise<Zone> {
    return this.zonesService.getZoneById(store.id, zoneId);
  }

  @Patch(':zoneId')
  @StoreManager()
  async updateZone(
    @CurrentStore() store: StoreContextDto,
    @Param('zoneId') zoneId: string,
    @Body() dto: UpdateZoneDto,
  ): Promise<Zone> {
    return this.zonesService.updateZone(store.id, zoneId, dto);
  }

  @Put('reorder')
  @StoreManager()
  async reorderZones(
    @CurrentStore() store: StoreContextDto,
    @Body('orderedIds') orderedIds: string[],
  ): Promise<Zone[]> {
    return this.zonesService.reorderZones(store.id, orderedIds);
  }

  @Delete(':zoneId')
  @StoreManager()
  async deleteZone(
    @CurrentStore() store: StoreContextDto,
    @Param('zoneId') zoneId: string,
  ): Promise<void> {
    return this.zonesService.deleteZone(store.id, zoneId);
  }
}
