import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Zone } from '../entities/zone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateZoneDto, UpdateZoneDto } from '../dtos/zones/zone.dto';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
  ) {}

  async createZone(storeId: string, dto: CreateZoneDto): Promise<Zone> {
    const count = await this.countZonesInStore(storeId);

    const zone = this.zoneRepository.create({
      ...dto,
      storeId,
      sortOrder: count + 1,
    });

    return this.zoneRepository.save(zone);
  }

  async getZonesInStore(storeId: string): Promise<Zone[]> {
    return this.zoneRepository.find({
      where: { storeId },
      order: { sortOrder: 'ASC' },
    });
  }

  async getZoneById(storeId: string, id: string): Promise<Zone> {
    const zone = await this.findZoneById(storeId, id);

    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    return zone;
  }

  async findZoneById(storeId: string, id: string): Promise<Zone | null> {
    return this.zoneRepository.findOneBy({ id, storeId });
  }

  async updateZone(
    storeId: string,
    id: string,
    dto: UpdateZoneDto,
  ): Promise<Zone> {
    const zone = await this.getZoneById(storeId, id);

    Object.assign(zone, dto);
    return this.zoneRepository.save(zone);
  }

  async reorderZones(storeId: string, orderedIds: string[]): Promise<Zone[]> {
    const zones = await this.getZonesInStore(storeId);

    if (zones.length !== orderedIds.length) {
      throw new BadRequestException(
        'Invalid zone order provided or missing zones',
      );
    }

    const zonesMap = new Map(zones.map((z) => [z.id, z]));

    const updatedZones: Zone[] = [];

    for (let i = 0; i < orderedIds.length; i++) {
      const zone = zonesMap.get(orderedIds[i]);

      if (!zone) {
        throw new BadRequestException('Invalid zone id');
      }

      zone.sortOrder = i + 1;
      updatedZones.push(zone);
    }

    await this.zoneRepository.manager.transaction(async (manager) => {
      await manager.save(updatedZones);
    });

    return updatedZones;
  }

  async deleteZone(storeId: string, id: string): Promise<void> {
    const zone = await this.getZoneById(storeId, id);
    await this.zoneRepository.remove(zone);
  }

  private async countZonesInStore(storeId: string): Promise<number> {
    return this.zoneRepository.count({ where: { storeId } });
  }
}
