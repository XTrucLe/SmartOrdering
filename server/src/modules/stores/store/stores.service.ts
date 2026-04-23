import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from '../store/dtos/create-store.dto';
import { UpdateStoreDto } from '../store/dtos/update-store.dto';
import { Pages } from '@/common/interfaces/page.interface';
import { Account } from '@/modules/identity/entities/account.entity';
import { BaseService } from '@/common/services/base.service';

@Injectable()
export class StoresService extends BaseService<Store> {
  constructor(
    @InjectRepository(Store)
    repository: Repository<Store>,
  ) {
    super(repository, Store);
  }

  async createStore(
    accountId: string,
    dto: CreateStoreDto,
    manager?: EntityManager,
  ): Promise<Store> {
    const slug = dto.slug
      ? await this.validateCustomSlug(dto.slug, this.getRepo(manager))
      : await this.generateUniqueSlug(dto.name, this.getRepo(manager));

    const store = this.getRepo(manager).create({
      ...dto,
      slug,
      account: { id: accountId },
    });

    return this.saveOrThrowConflict(store, this.getRepo(manager));
  }

  async getStoreById(id: string, manager?: EntityManager): Promise<Store> {
    const store = await this.getRepo(manager).findOneBy({
      id,
      isActive: true,
    });

    if (!store) throw new NotFoundException('Store not found.');
    return store;
  }

  async getStoreBySlug(slug: string, manager?: EntityManager): Promise<Store> {
    const store = await this.getRepo(manager).findOneBy({
      slug,
      isActive: true,
    });

    if (!store) throw new NotFoundException('Store not found.');
    return store;
  }

  async getAllStores(page = 1, limit = 10): Promise<Pages<Store>> {
    return this.paginate({ isActive: true }, page, limit);
  }

  async getMyStores(accountId: string, page = 1, limit = 10): Promise<Pages<Store>> {
    return this.paginate({ account: { id: accountId } as Account, isActive: true }, page, limit);
  }

  async updateStore(id: string, dto: UpdateStoreDto): Promise<Store> {
    const store = await this.getStoreById(id);

    if (dto.slug) {
      store.slug = await this.validateCustomSlug(dto.slug, this.getRepo());
    }

    Object.assign(store, dto);

    return this.saveOrThrowConflict(store, this.getRepo());
  }

  async deleteStore(id: string): Promise<void> {
    await this.getStoreById(id);
    await this.getRepo().softDelete(id);
  }

  private async saveOrThrowConflict(store: Store, repo: Repository<Store>): Promise<Store> {
    try {
      return await repo.save(store);
    } catch (err: any) {
      if (err instanceof Error && 'code' in err && err.code === '23505') {
        throw new ConflictException('Store slug already exists.');
      }
      throw err;
    }
  }

  private async generateUniqueSlug(name: string, repo: Repository<Store>): Promise<string> {
    const baseSlug = this.slugify(name);
    let slug = baseSlug;
    let counter = 0;

    while (await repo.exist({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  private async validateCustomSlug(slug: string, repo: Repository<Store>): Promise<string> {
    const normalized = this.slugify(slug);

    const exists = await repo.exist({ where: { slug: normalized } });
    if (exists) throw new ConflictException('Slug already exists.');

    return normalized;
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
