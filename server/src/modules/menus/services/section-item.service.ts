import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionItem } from '../entities/section-item.entity';
import { ItemService } from '@/modules/items/services/item.service';
import { CreateSectionItemDto } from '../dtos/section-items/create-section-item.dto';
import {
  UpdateSectionItemDto,
  UpdateSectionItemOrderDto,
} from '../dtos/section-items/update-section-item.dto';
import { Section } from '../entities/section.entity';

@Injectable()
export class SectionItemService {
  constructor(
    @InjectRepository(SectionItem)
    private readonly repo: Repository<SectionItem>,
    private readonly itemService: ItemService,
  ) {}

  async addNewItems(
    storeId: string,
    sectionId: string,
    dto: CreateSectionItemDto,
  ): Promise<SectionItem> {
    await this.checkSection(storeId, sectionId);
    return this.create(storeId, sectionId, dto);
  }

  async create(
    storeId: string,
    sectionId: string,
    dto: CreateSectionItemDto,
    manager?: EntityManager,
  ): Promise<SectionItem> {
    const repo = manager ? manager.getRepository(SectionItem) : this.repo;

    const item = await this.itemService.getItemById(storeId, dto.itemId);

    const sectionItem = repo.create({
      sectionId,
      itemId: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      unit: item.unit,
      isAvailable: item.isAvailable,
      displayOrder: item.displayOrder ?? 1,
      price: dto.price ?? item.basePrice,
      currency: item.currency,
    });

    sectionItem.options = item.optionGroup.map((opt) => ({
      name: opt.name,
      require: opt.isRequired,
      minSelection: opt.minSelection,
      maxSelection: opt.maxSelection,
      choices: opt.options.map((c) => ({
        name: c.name,
        extraPrice: c.extraPrice,
      })),
    }));

    return repo.save(sectionItem);
  }

  async findOne(storeId: string, itemId: string): Promise<SectionItem> {
    const item = await this.repo.findOne({ where: { id: itemId, section: { menu: { storeId } } } });

    if (!item) {
      throw new NotFoundException(`Item not found`);
    }

    return item;
  }

  async update(storeId: string, itemId: string, dto: UpdateSectionItemDto): Promise<SectionItem> {
    const item = await this.findOne(storeId, itemId);
    return this.repo.save({ ...item, ...dto });
  }

  async remove(storeId: string, itemId: string): Promise<void> {
    const item = await this.findOne(storeId, itemId);
    await this.repo.remove(item);
  }

  async getAllBySection(storeId: string, sectionId: string): Promise<SectionItem[]> {
    await this.checkSection(storeId, sectionId);
    return this.repo.find({
      where: { sectionId },
      order: { displayOrder: 'ASC' },
      relations: ['item'],
    });
  }

  async reOrder(storeId: string, sectionId: string, dto: UpdateSectionItemOrderDto): Promise<void> {
    const items = await this.getAllBySection(storeId, sectionId);
    const itemMap = new Map(items.map((i) => [i.id, i]));

    const updatedItems = dto.itemIds.map((id, index) => {
      const item = itemMap.get(id);
      if (!item) {
        throw new NotFoundException(`Item "${id}" not found in section "${sectionId}"`);
      }
      return { ...item, displayOrder: index };
    });

    await this.repo.save(updatedItems);
  }

  async syncSectionItems(storeId: string, sectionId: string, itemId: string) {
    const sectionItem = await this.repo.findOne({
      where: { sectionId, itemId, section: { menu: { storeId } } },
    });
    if (!sectionItem) {
      throw new NotFoundException(`Section item not found`);
    }
    const item = await this.itemService.getItemById(storeId, sectionItem.itemId);
    sectionItem.name = item.name;
    sectionItem.description = item.description;
    sectionItem.imageUrl = item.imageUrl;
    sectionItem.isAvailable = item.isAvailable;
    sectionItem.displayOrder = item.displayOrder ?? 1;
    sectionItem.currency = item.currency;
    sectionItem.unit = item.unit;
    sectionItem.options = item.optionGroup.map((opt) => ({
      name: opt.name,
      require: opt.isRequired,
      minSelection: opt.minSelection,
      maxSelection: opt.maxSelection,
      choices: opt.options.map((c) => ({
        name: c.name,
        extraPrice: c.extraPrice,
      })),
    }));
    return this.repo.save(sectionItem);
  }

  private async checkSection(storeId: string, sectionId: string): Promise<void> {
    const exists = await this.repo.manager
      .getRepository(Section)
      .exists({ where: { id: sectionId, menu: { storeId } } });
    if (!exists) {
      throw new NotFoundException(`Section "${sectionId}" not found in store "${storeId}"`);
    }
  }
}
