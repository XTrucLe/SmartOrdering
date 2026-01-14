import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
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

  async createMenuItem(
    storeId: string,
    menuId: string,
    menuSectionId: string,
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    const menuSection = await this.menuSectionService.getMenuSectionById(
      storeId,
      menuId,
      menuSectionId,
    );

    const item = await this.itemsService.getItemById(createMenuItemDto.itemId);
    const nextDisplayOrder = await this.getNextDisplayOrder(menuSectionId);

    const menuItem = this.menuItemRepository.create({
      ...createMenuItemDto,
      displayOrder: createMenuItemDto.displayOrder ?? nextDisplayOrder,
      menuSection,
      item,
    });
    return this.menuItemRepository.save(menuItem);
  }

  async getMenuItemsByMenuSectionId(
    storeId: string,
    menuId: string,
    menuSectionId: string,
  ): Promise<MenuItem[]> {
    await this.menuSectionService.getMenuSectionById(
      storeId,
      menuId,
      menuSectionId,
    );

    return this.menuItemRepository.find({
      where: { menuSection: { id: menuSectionId } },
      relations: { item: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async getMenuItemById(
    storeId: string,
    menuId: string,
    menuSectionId: string,
    menuItemId: string,
  ): Promise<MenuItem> {
    const menuSection = await this.menuSectionService.getMenuSectionById(
      storeId,
      menuId,
      menuSectionId,
    );

    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id: menuItemId,
        menuSection: { id: menuSection.id },
      },
      relations: { item: true },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async updateMenuItem(
    storeId: string,
    menuId: string,
    menuSectionId: string,
    menuItemId: string,
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    const menuItem = await this.getMenuItemById(
      storeId,
      menuId,
      menuSectionId,
      menuItemId,
    );

    this.menuItemRepository.merge(menuItem, updateMenuItemDto);
    return this.menuItemRepository.save(menuItem);
  }

  async deleteMenuItem(
    storeId: string,
    menuId: string,
    menuSectionId: string,
    menuItemId: string,
  ): Promise<void> {
    const menuItem = await this.getMenuItemById(
      storeId,
      menuId,
      menuSectionId,
      menuItemId,
    );

    await this.menuItemRepository.remove(menuItem);
  }

  private async getNextDisplayOrder(menuSectionId: string): Promise<number> {
    const lastItem = await this.menuItemRepository.findOne({
      where: { menuSection: { id: menuSectionId } },
      order: { displayOrder: 'DESC' },
      select: ['displayOrder'],
    });

    return lastItem ? lastItem.displayOrder + 1 : 0;
  }
}
