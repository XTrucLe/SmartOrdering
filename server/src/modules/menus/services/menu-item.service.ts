import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuItemDto } from '../dtos/menu-items/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dtos/menu-items/update-menu-item.dto';
import { MenuSectionService } from './menu-section.service';
import { ItemsService } from '../../items/items.service';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly menuSectionService: MenuSectionService,
    private readonly itemsService: ItemsService,
  ) {}

  async create(
    storeId: string,
    sectionId: string,
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    const { itemId } = createMenuItemDto;

    const menuSection = await this.menuSectionService.findOne(
      storeId,
      sectionId,
    );

    const item = await this.itemsService.getItemById(itemId);

    const displayOrder =
      createMenuItemDto.displayOrder ??
      (await this.getNextDisplayOrder(sectionId));

    const menuItem = this.menuItemRepository.create({
      ...createMenuItemDto,
      displayOrder,
      menuSection,
      item,
    });
    return this.menuItemRepository.save(menuItem);
  }

  async findAllBySection(
    storeId: string,
    sectionId: string,
  ): Promise<MenuItem[]> {
    await this.menuSectionService.findOne(storeId, sectionId);

    return this.menuItemRepository.find({
      where: { menuSection: { id: sectionId } },
      relations: { item: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(storeId: string, itemId: string): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id: itemId,
        menuSection: { menu: { store: { id: storeId } } },
      },
      relations: { item: true },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu Item with ID "${itemId}" not found`);
    }

    return menuItem;
  }

  async update(
    storeId: string,
    itemId: string,
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    const menuItem = await this.findOne(storeId, itemId);
    const updatedMenuItem = this.menuItemRepository.merge(
      menuItem,
      updateMenuItemDto,
    );
    return this.menuItemRepository.save(updatedMenuItem);
  }

  async remove(storeId: string, itemId: string): Promise<void> {
    const menuItem = await this.findOne(storeId, itemId);
    await this.menuItemRepository.remove(menuItem);
  }

  async updateOrder(
    storeId: string,
    sectionId: string,
    orderedItemIds: string[],
  ): Promise<void> {
    await this.menuSectionService.findOne(storeId, sectionId);

    const menuItems = await this.menuItemRepository.find({
      where: {
        id: In(orderedItemIds),
        menuSection: { id: sectionId },
      },
    });

    if (menuItems.length !== orderedItemIds.length) {
      throw new NotFoundException('One or more item IDs are invalid.');
    }

    const updatedItems = menuItems.map((item) => {
      const newOrder = orderedItemIds.indexOf(item.id);
      return { ...item, displayOrder: newOrder };
    });

    await this.menuItemRepository.save(updatedItems);
  }

  private async getNextDisplayOrder(menuSectionId: string): Promise<number> {
    const lastItem = await this.menuItemRepository.findOne({
      where: { menuSection: { id: menuSectionId } },
      order: { displayOrder: 'DESC' },
    });

    return lastItem ? lastItem.displayOrder + 1 : 0;
  }
}
