import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { ItemStatus } from './constants/item.constant';
import { StoresService } from '../stores/stores.service';
import { MenuService } from '../menus/menu.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly storeService: StoresService,
    private readonly menuService: MenuService,
  ) {}

  async createItem(storeId: string, dto: CreateItemDto): Promise<Item> {
    await this.existsStore(storeId);
    if (dto.menuId) {
      await this.existsMenu(dto.menuId);
    }

    await this.existsItem(storeId, dto.name);

    const item = this.itemRepository.create({
      ...dto,
      menu: { id: dto.menuId },
      store: { id: storeId },
    });

    return this.itemRepository.save(item);
  }

  async queryItems(
    storeId: string,
    options?: { query?: string; menuId?: string },
  ): Promise<Item[]> {
    const qb = this.itemRepository
      .createQueryBuilder('item')
      .where('item.storeId = :storeId', { storeId })
      .andWhere('item.status = :status', { status: ItemStatus.ACTIVE });

    if (options?.query) {
      qb.andWhere('unaccent(item.name) ILIKE unaccent(:query)', {
        query: `%${options.query}%`,
      });
    }

    if (options?.menuId) {
      qb.andWhere('item.menuId = :menuId', { menuId: options.menuId });
    }

    return qb.getMany();
  }

  async getItemById(id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['store'],
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found.`);
    }
    return item;
  }

  async getItemsByIds(ids: string[]): Promise<Item[]> {
    return this.itemRepository.find({
      where: { id: In(ids) },
      relations: ['store'],
    });
  }

  async updateItem(id: string, dto: UpdateItemDto): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found.`);
    }
    Object.assign(item, dto);
    return this.itemRepository.save(item);
  }

  async deleteItem(id: string): Promise<void> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found.`);
    }
    await this.itemRepository.remove(item);
  }

  async toggleItemStatus(id: string, status: ItemStatus): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found.`);
    }
    item.status = status;
    return this.itemRepository.save(item);
  }

  private async existsStore(storeId: string): Promise<void> {
    const existingStore = await this.storeService.getStoreById(storeId);
    if (!existingStore) {
      throw new NotFoundException(`Store with ID ${storeId} not found.`);
    }
  }

  private async existsMenu(menuId: string): Promise<void> {
    const exitstMenu = await this.menuService.getMenuById(menuId);
    if (!exitstMenu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found.`);
    }
  }

  private async existsItem(storeId: string, name: string): Promise<void> {
    const existingItem = await this.itemRepository.findOne({
      where: { name, store: { id: storeId } },
    });
    if (existingItem) {
      throw new ConflictException(`Item with name ${name} already exists.`);
    }
  }
}
