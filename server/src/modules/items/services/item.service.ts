import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { CreateItemDto, UpdateItemDto } from '../dtos/item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}

  async getAllByStore(storeId: string): Promise<Item[]> {
    return this.itemRepo.find({
      where: { storeId },
      relations: ['optionGroup', 'optionGroup.options'],
      order: {
        displayOrder: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async getItemById(storeId: string, itemId: string): Promise<Item> {
    const item = await this.itemRepo.findOne({
      where: { id: itemId, storeId },
      relations: ['optionGroup', 'optionGroup.options'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async createItem(storeId: string, dto: CreateItemDto): Promise<Item> {
    const existingItem = await this.itemRepo.findOne({ where: { name: dto.name, storeId } });

    if (existingItem) {
      throw new ConflictException('Item already exists');
    }

    const item = this.itemRepo.create({
      ...dto,
      storeId,
    });

    return this.itemRepo.save(item);
  }

  async updateItem(storeId: string, itemId: string, dto: UpdateItemDto): Promise<Item> {
    const item = await this.itemRepo.findOne({ where: { id: itemId, storeId } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    this.itemRepo.merge(item, dto);

    return this.itemRepo.save(item);
  }

  async deleteItem(storeId: string, itemId: string): Promise<void> {
    const item = await this.itemRepo.findOne({ where: { id: itemId, storeId } });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.itemRepo.softRemove(item);
  }
}
