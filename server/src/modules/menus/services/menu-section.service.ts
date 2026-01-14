import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuSection } from '../entities/menu-section.entity';
import { CreateMenuSectionDto } from '../dtos/menu-sections/create-menu-section.dto';
import { UpdateMenuSectionDto } from '../dtos/menu-sections/update-menu-section.dto';
import { MenuService } from './menu.service';
import { MenuItem } from '../entities/menu-item.entity';

@Injectable()
export class MenuSectionService {
  constructor(
    @InjectRepository(MenuSection)
    private readonly menuSectionRepository: Repository<MenuSection>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly menuService: MenuService,
  ) {}

  async createMenuSection(
    storeId: string,
    menuId: string,
    createMenuSectionDto: CreateMenuSectionDto,
  ): Promise<MenuSection> {
    const menu = await this.menuService.getMenuById(storeId, menuId);

    const nextDisplayOrder = await this.getNextDisplayOrder(menuId);

    const menuSection = this.menuSectionRepository.create({
      ...createMenuSectionDto,
      displayOrder: createMenuSectionDto.displayOrder ?? nextDisplayOrder,
      menu,
    });

    return this.menuSectionRepository.save(menuSection);
  }

  async getMenuSectionsByMenuId(
    storeId: string,
    menuId: string,
  ): Promise<MenuSection[]> {
    // Validate menu existence (optional, but good for security)
    // await this.menuService.getMenuById(storeId, menuId);

    return this.menuSectionRepository.find({
      where: {
        menu: { id: menuId, store: { id: storeId } },
      },
      order: {
        displayOrder: 'ASC',
      },
    });
  }

  async getMenuSectionById(
    storeId: string,
    menuId: string,
    menuSectionId: string,
  ): Promise<MenuSection> {
    const menuSection = await this.menuSectionRepository.findOne({
      where: {
        id: menuSectionId,
        menu: { id: menuId, store: { id: storeId } },
      },
    });

    if (!menuSection) {
      throw new NotFoundException('Menu section not found');
    }

    return menuSection;
  }

  async updateMenuSection(
    storeId: string,
    menuId: string,
    menuSectionId: string,
    updateMenuSectionDto: UpdateMenuSectionDto,
  ): Promise<MenuSection> {
    const menuSection = await this.getMenuSectionById(
      storeId,
      menuId,
      menuSectionId,
    );

    this.menuSectionRepository.merge(menuSection, updateMenuSectionDto);

    return this.menuSectionRepository.save(menuSection);
  }

  async deleteMenuSection(
    storeId: string,
    menuId: string,
    menuSectionId: string,
  ): Promise<void> {
    const menuSection = await this.getMenuSectionById(
      storeId,
      menuId,
      menuSectionId,
    );

    await this.menuItemRepository.delete({
      menuSection: { id: menuSection.id },
    });

    await this.menuSectionRepository.remove(menuSection);
  }

  async reOrderMenuSections(
    storeId: string,
    menuId: string,
    orderedSectionIds: string[],
  ): Promise<void> {
    const menuSections = await this.menuSectionRepository.find({
      where: {
        id: In(orderedSectionIds),
        menu: { id: menuId, store: { id: storeId } },
      },
    });

    const menuSectionMap = new Map(
      menuSections.map((section) => [section.id, section]),
    );

    orderedSectionIds.forEach((sectionId, index) => {
      const section = menuSectionMap.get(sectionId);
      if (section) {
        section.displayOrder = index;
      }
    });

    await this.menuSectionRepository.save(menuSections);
  }

  private async getNextDisplayOrder(menuId: string): Promise<number> {
    const lastSection = await this.menuSectionRepository.findOne({
      where: { menu: { id: menuId } },
      order: { displayOrder: 'DESC' },
      select: ['displayOrder'],
    });

    return lastSection ? lastSection.displayOrder + 1 : 0;
  }
}
