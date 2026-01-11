import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Store } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { StoreStatus } from './constants/store.constant';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async createStore(dto: CreateStoreDto): Promise<Store> {
    const slug = dto.slug
      ? await this.validateCustomSlug(dto.slug)
      : await this.generateUniqueSlug(dto.name);

    const store = this.storeRepository.create({
      name: dto.name,
      slug,
      description: dto.description,
    });

    try {
      return await this.storeRepository.save(store);
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === '23505') {
        throw new ConflictException('Store slug already exists.');
      }
      throw err;
    }
  }

  async getStoreById(id: string): Promise<Store> {
    const store = await this.storeRepository.findOneBy({
      id,
      status: StoreStatus.ACTIVE,
    });
    if (!store) {
      throw new NotFoundException('Store not found.');
    }
    return store;
  }

  async getStoreBySlug(slug: string): Promise<Store> {
    const store = await this.storeRepository.findOneBy({ slug });
    if (!store) {
      throw new NotFoundException('Store not found.');
    }
    return store;
  }

  async getAllStores(): Promise<Store[]> {
    return this.storeRepository.find({
      where: { status: StoreStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStore(
    id: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.getStoreById(id);
    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async deleteStore(id: string): Promise<void> {
    const store = await this.getStoreById(id);
    await this.storeRepository.remove(store);
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = this.slugify(name);

    let slug = baseSlug;
    let counter = 0;

    while (await this.storeRepository.exist({ where: { slug } })) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async validateCustomSlug(slug: string): Promise<string> {
    const exists = await this.storeRepository.exist({ where: { slug } });
    if (exists) {
      throw new ConflictException('Slug already exists.');
    }
    return slug;
  }
}
