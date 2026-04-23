import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreConfig } from './config.entity';
import { UpdateStoreConfigDto } from './config.dto';
import { merge } from '@/common/utils/merge';

@Injectable()
export class StoreConfigService {
  constructor(
    @InjectRepository(StoreConfig)
    private readonly repo: Repository<StoreConfig>,
  ) {}

  async findConfig(storeId: string): Promise<StoreConfig | null> {
    return this.repo.findOne({ where: { storeId } });
  }

  async getConfig(storeId: string): Promise<StoreConfig> {
    const config = await this.findConfig(storeId);

    if (!config) {
      throw new NotFoundException('Store config not found');
    }

    return config;
  }

  async createOrUpdate(storeId: string, dto: UpdateStoreConfigDto): Promise<StoreConfig> {
    const existing = await this.findConfig(storeId);

    const base = existing ?? this.repo.create({ storeId });

    const merged = merge(base, dto as Partial<StoreConfig>);

    return this.repo.save(merged);
  }

  async update(storeId: string, dto: UpdateStoreConfigDto): Promise<StoreConfig> {
    const config = await this.findConfig(storeId);

    if (!config) {
      throw new NotFoundException('Store config not found');
    }

    const merged = merge(config, dto as Partial<StoreConfig>);

    return this.repo.save(merged);
  }
}
