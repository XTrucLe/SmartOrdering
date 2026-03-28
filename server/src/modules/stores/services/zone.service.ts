import { Injectable, NotFoundException } from '@nestjs/common';
import { Store } from '../entities/store.entity';
import { Zone } from '../entities/zone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateZoneDto, UpdateZoneDto } from '../dtos/zones/zone.dto';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async createZone(storeId: string, dto: CreateZoneDto): Promise<Zone> {
    await this.ensureStoreExists(storeId);

    const zone = this.zoneRepository.create({
      ...dto,
      storeId,
    });

    return this.zoneRepository.save(zone);
  }

  async getZonesByStoreId(storeId: string): Promise<Zone[]> {
    return this.zoneRepository.find({
      where: { storeId },
      order: { createdAt: 'DESC' },
    });
  }

  async getZoneById(id: string): Promise<Zone> {
    const zone = await this.zoneRepository.findOneBy({ id });

    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    return zone;
  }

  async updateZone(id: string, dto: UpdateZoneDto): Promise<Zone> {
    const zone = await this.getZoneById(id);

    Object.assign(zone, dto);
    return this.zoneRepository.save(zone);
  }

  async deleteZone(id: string): Promise<void> {
    const zone = await this.getZoneById(id);
    await this.zoneRepository.remove(zone);
  }

  private async ensureStoreExists(storeId: string): Promise<void> {
    const exists = await this.storeRepository.exists({
      where: { id: storeId },
    });

    if (!exists) {
      throw new NotFoundException('Store not found');
    }
  }
}
