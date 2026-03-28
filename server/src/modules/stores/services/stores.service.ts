import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto } from '../dtos/stores/create-store.dto';
import { UpdateStoreDto } from '../dtos/stores/update-store.dto';
import { Pages } from '@/common/interfaces/page.interface';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async createStore(
    accountId: string,
    dto: CreateStoreDto,
    manager?: EntityManager,
  ): Promise<Store> {
    const repo = manager ? manager.getRepository(Store) : this.storeRepository;

    const slug = dto.slug
      ? await this.validateCustomSlug(dto.slug)
      : await this.generateUniqueSlug(dto.name);

    const store = repo.create({
      ...dto,
      slug,
      account: { id: accountId },
    });

    return this.saveStoreOrThrowConflict(store, manager);
  }

  async getStoreById(id: string, manager?: EntityManager): Promise<Store> {
    const repo = manager ? manager.getRepository(Store) : this.storeRepository;
    const store = await repo.findOneBy({ id, isActive: true });
    if (!store) throw new NotFoundException('Store not found.');

    return store;
  }

  async getStoreBySlug(slug: string, manager?: EntityManager): Promise<Store> {
    const repo = manager ? manager.getRepository(Store) : this.storeRepository;
    const store = await repo.findOneBy({
      slug,
      isActive: true,
    });
    if (!store) throw new NotFoundException('Store not found.');
    return store;
  }

  async getAllStores(
    page: number = 1,
    limit: number = 10,
  ): Promise<Pages<Store>> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.storeRepository.findAndCount({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async getMyStores(
    accountId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Pages<Store>> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.storeRepository.findAndCount({
      where: { account: { id: accountId }, isActive: true },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async updateStore(id: string, dto: UpdateStoreDto): Promise<Store> {
    const store = await this.getStoreById(id);
    Object.assign(store, dto);
    if (dto.slug) {
      store.slug = await this.validateCustomSlug(dto.slug);
    }
    return this.saveStoreOrThrowConflict(store);
  }

  async deleteStore(id: string): Promise<void> {
    await this.getStoreById(id);
    await this.storeRepository.softDelete(id);
  }

  private async saveStoreOrThrowConflict(
    store: Store,
    manager?: EntityManager,
  ): Promise<Store> {
    const repo = manager ? manager.getRepository(Store) : this.storeRepository;
    try {
      return await repo.save(store);
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === '23505') {
        throw new ConflictException('Store slug already exists.');
      }
      throw err;
    }
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
    slug = this.slugify(slug);
    const exists = await this.storeRepository.exists({ where: { slug } });
    if (exists) throw new ConflictException('Slug already exists.');
    return slug;
  }
}
