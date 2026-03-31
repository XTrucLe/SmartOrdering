import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ZonesService } from '../services/zone.service';
import { CreateZoneDto, UpdateZoneDto } from '../dtos/zones/zone.dto';
import { Zone } from '../entities/zone.entity';
import { JwtGuard } from '@/modules/auth/guards/jwt.guard';
import { StoreRoleGuard } from '../guards/store-role.guard';
import { StoreManager } from '../decorators/store-role-group.decorator';
import { CurrentStore } from '../decorators/current-store.decorator';
import { StoreInfo } from '../dtos/stores/store-info.dto';

@Controller('/zones')
@UseGuards(JwtGuard, StoreRoleGuard)
export class ZoneController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @StoreManager()
  async createZone(
    @CurrentStore() store: StoreInfo,
    @Body() dto: CreateZoneDto,
  ): Promise<Zone> {
    return this.zonesService.createZone(store.id, dto);
  }

  @Get()
  async getZonesInStore(@CurrentStore() store: StoreInfo): Promise<Zone[]> {
    return this.zonesService.getZonesInStore(store.id);
  }

  @Get(':zoneId')
  async getZoneById(
    @CurrentStore() store: StoreInfo,
    @Param('zoneId') zoneId: string,
  ): Promise<Zone> {
    return this.zonesService.getZoneById(store.id, zoneId);
  }

  @Patch(':zoneId')
  @StoreManager()
  async updateZone(
    @CurrentStore() store: StoreInfo,
    @Param('zoneId') zoneId: string,
    @Body() dto: UpdateZoneDto,
  ): Promise<Zone> {
    return this.zonesService.updateZone(store.id, zoneId, dto);
  }

  @Put('reorder')
  @StoreManager()
  async reorderZones(
    @CurrentStore() store: StoreInfo,
    @Body('orderedIds') orderedIds: string[],
  ): Promise<Zone[]> {
    return this.zonesService.reorderZones(store.id, orderedIds);
  }

  @Delete(':zoneId')
  @StoreManager()
  async deleteZone(
    @CurrentStore() store: StoreInfo,
    @Param('zoneId') zoneId: string,
  ): Promise<void> {
    return this.zonesService.deleteZone(store.id, zoneId);
  }
}
