import { Injectable } from '@nestjs/common';
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
    const store = await this.storeRepository.findOneBy({ id: storeId });
    if (!store) {
      throw new Error('Store not found.');
    }
    const zone = this.zoneRepository.create({ ...dto, store });
    return this.zoneRepository.save(zone);
  }

  async getZonesByStoreId(storeId: string): Promise<Zone[]> {
    return this.zoneRepository.find({
      where: { store: { id: storeId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getZoneById(id: string): Promise<Zone> {
    const zone = await this.zoneRepository.findOneBy({ id });
    if (!zone) {
      throw new Error('Zone not found.');
    }
    return zone;
  }

  async updateZone(id: string, dto: UpdateZoneDto): Promise<Zone> {
    const zone = await this.getZoneById(id);
    Object.assign(zone, dto);
    return this.zoneRepository.save(zone);
  }

  async deleteZone(id: string): Promise<void> {
    await this.zoneRepository.delete(id);
  }
}
