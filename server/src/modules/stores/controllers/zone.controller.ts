import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ZonesService } from '../services/zone.service';
import { CreateZoneDto, UpdateZoneDto } from '../dtos/zones/zone.dto';
import { Zone } from '../entities/zone.entity';

@Controller('stores/:storeId/zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  async createZone(
    @Param('storeId') storeId: string,
    @Body() dto: CreateZoneDto,
  ): Promise<Zone> {
    return this.zonesService.createZone(storeId, dto);
  }

  @Get()
  async getZonesByStoreId(@Param('storeId') storeId: string): Promise<Zone[]> {
    return this.zonesService.getZonesByStoreId(storeId);
  }

  @Get(':zoneId')
  async getZoneById(@Param('zoneId') zoneId: string): Promise<Zone> {
    return this.zonesService.getZoneById(zoneId);
  }

  @Patch(':zoneId')
  async updateZone(
    @Param('zoneId') zoneId: string,
    @Body() dto: UpdateZoneDto,
  ): Promise<Zone> {
    return this.zonesService.updateZone(zoneId, dto);
  }

  @Delete(':zoneId')
  async deleteZone(@Param('zoneId') zoneId: string): Promise<void> {
    return this.zonesService.deleteZone(zoneId);
  }
}
