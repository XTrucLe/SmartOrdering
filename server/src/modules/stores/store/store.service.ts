import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Pages } from '@/common/interfaces/page.interface';
import { Account } from '@/modules/identity/entities/account.entity';
import { BaseService } from '@/common/services/base.service';
import { StatusNextAction, StoreStatus } from '../common/constants/store-status.constant';

@Injectable()
export class StoreService extends BaseService<Store> {
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

    const existsPendingStore = await this.getRepo(manager).exists({
      where: {
        owner: { id: accountId },
        status: StoreStatus.PENDING,
      },
    });

    if (existsPendingStore) {
      throw new ConflictException(
        'You already have a pending store application. Please wait for it to be reviewed before creating a new one.',
      );
    }

    const store = this.getRepo(manager).create({
      ...dto,
      slug,
      owner: { id: accountId },
    });

    return this.saveOrThrowConflict(store, this.getRepo(manager));
  }

  async getStoreById(storeId: string, manager?: EntityManager): Promise<Store> {
    const store = await this.getRepo(manager).findOneBy({
      id: storeId,
    });

    if (!store) throw new NotFoundException('Store not found.');
    return store;
  }

  async getStoreBySlug(slug: string, manager?: EntityManager): Promise<Store> {
    const store = await this.getRepo(manager).findOneBy({
      slug,
    });

    if (!store) throw new NotFoundException('Store not found.');
    return store;
  }

  async getListShortStores(accountId: string): Promise<Store[]> {
    const stores = await this.getRepo().find({
      where: { owner: { id: accountId } },
      select: ['id', 'name', 'slug'],
    });

    if (stores.length === 0) {
      throw new NotFoundException('Account not found or has no stores.');
    }
    return stores;
  }

  async getAllStores(page = 1, limit = 10): Promise<Pages<Store>> {
    return this.paginate({}, page, limit);
  }

  async getMyStores(accountId: string): Promise<Store[]> {
    const stores = await this.repository.find({
      where: { members: { accountId } },
      relations: ['members'],
    });

    if (!stores || stores.length === 0) throw new NotFoundException('Store not found.');

    return stores;
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

  async createWithOwner(
    dto: CreateStoreDto,
    account: Account,
    manager: EntityManager,
  ): Promise<Store> {
    const slug = dto.slug
      ? await this.validateCustomSlug(dto.slug, this.getRepo(manager))
      : await this.generateUniqueSlug(dto.name, this.getRepo(manager));
    const store = this.getRepo(manager).create({
      ...dto,
      slug,
      owner: { id: account.id },
    });

    return this.saveOrThrowConflict(store, this.getRepo(manager));
  }

  async activeStore(storeId: string, manager?: EntityManager): Promise<Store> {
    const store = await this.getStoreById(storeId, manager);
    return this.changeStoreStatus(store, StoreStatus.ACTIVE, manager);
  }

  async rejectStore(storeId: string, manager?: EntityManager): Promise<Store> {
    const store = await this.getStoreById(storeId, manager);
    return this.changeStoreStatus(store, StoreStatus.REJECTED, manager);
  }

  async suspendStore(storeId: string, manager?: EntityManager): Promise<Store> {
    const store = await this.getStoreById(storeId, manager);
    return this.changeStoreStatus(store, StoreStatus.SUSPENDED, manager);
  }

  private async changeStoreStatus(
    store: Store,
    status: StoreStatus,
    manager?: EntityManager,
  ): Promise<Store> {
    if (store.status === status) {
      throw new ConflictException(`Store is already ${status}.`);
    }
    if (!StatusNextAction[store.status]?.includes(status)) {
      throw new ConflictException(`Invalid status transition from ${store.status} to ${status}.`);
    }
    store.status = status;
    return this.getRepo(manager).save(store);
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
