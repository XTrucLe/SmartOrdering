import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuItemDto } from '../dtos/menu-items/create-menu-item.dto';
import { UpdateMenuItemDto, UpdateMenuItemOrderDto } from '../dtos/menu-items/update-menu-item.dto';
import { MenuSectionService } from './menu-section.service';
import { ProductService } from '@/modules/catalog/services/product.service';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly repo: Repository<MenuItem>,
    private readonly sectionService: MenuSectionService,
    private readonly productService: ProductService,
  ) {}

  async create(storeId: string, sectionId: string, dto: CreateMenuItemDto): Promise<MenuItem> {
    const section = await this.sectionService.findOne(storeId, sectionId);

    const product = await this.productService.getProductById(storeId, dto.productId);

    const displayOrder = dto.displayOrder ?? (await this.getNextDisplayOrder(sectionId));

    const menuItem = this.repo.create({
      sectionId,
      menuSection: section,

      product,
      name: product.name,
      displayOrder,
      ...dto,
    });

    return this.repo.save(menuItem);
  }

  async findAllBySection(storeId: string, sectionId: string): Promise<MenuItem[]> {
    await this.sectionService.findOne(storeId, sectionId);

    return this.repo.find({
      where: { sectionId },
      relations: ['product'],
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(storeId: string, itemId: string): Promise<MenuItem> {
    const item = await this.repo.findOne({
      where: {
        id: itemId,
        menuSection: { menu: { store: { id: storeId } } },
      },
      relations: ['product'],
    });

    if (!item) {
      throw new NotFoundException(`MenuItem "${itemId}" not found`);
    }

    return item;
  }

  async update(storeId: string, itemId: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const item = await this.findOne(storeId, itemId);

    const updated = this.repo.merge(item, dto);

    return this.repo.save(updated);
  }

  async remove(storeId: string, itemId: string): Promise<void> {
    const item = await this.findOne(storeId, itemId);
    await this.repo.remove(item);
  }

  async updateOrder(
    storeId: string,
    sectionId: string,
    dto: UpdateMenuItemOrderDto,
  ): Promise<void> {
    const { itemIds } = dto;

    await this.sectionService.findOne(storeId, sectionId);

    const items = await this.repo.find({
      where: {
        id: In(itemIds),
        sectionId,
      },
    });

    if (items.length !== itemIds.length) {
      throw new NotFoundException('Invalid itemIds');
    }

    const orderMap = new Map(itemIds.map((id, index) => [id, index]));

    const updated = items.map((item) => ({
      ...item,
      displayOrder: orderMap.get(item.id)!,
    }));

    await this.repo.save(updated);
  }

  private async getNextDisplayOrder(sectionId: string): Promise<number> {
    const last = await this.repo.findOne({
      where: { sectionId },
      order: { displayOrder: 'DESC' },
    });

    return last ? last.displayOrder + 1 : 0;
  }
}
