import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuSection } from '../entities/menu-section.entity';
import { CreateMenuSectionDto } from '../dtos/menu-sections/create-menu-section.dto';
import { UpdateMenuSectionDto } from '../dtos/menu-sections/update-menu-section.dto';
import { MenuService } from './menu.service';

@Injectable()
export class MenuSectionService {
  constructor(
    @InjectRepository(MenuSection)
    private readonly menuSectionRepository: Repository<MenuSection>,
    private readonly menuService: MenuService,
  ) {}

  async create(
    storeId: string,
    menuId: string,
    createMenuSectionDto: CreateMenuSectionDto,
  ): Promise<MenuSection> {
    const menu = await this.menuService.findOne(storeId, menuId);

    const displayOrder =
      createMenuSectionDto.displayOrder ??
      (await this.getNextDisplayOrder(menuId));

    const menuSection = this.menuSectionRepository.create({
      ...createMenuSectionDto,
      displayOrder,
      menu,
    });

    return this.menuSectionRepository.save(menuSection);
  }

  async findAllByMenu(storeId: string, menuId: string): Promise<MenuSection[]> {
    await this.menuService.findOne(storeId, menuId);

    return this.menuSectionRepository.find({
      where: {
        menu: { id: menuId },
      },
      order: {
        displayOrder: 'ASC',
      },
    });
  }

  async findOne(storeId: string, sectionId: string): Promise<MenuSection> {
    const menuSection = await this.menuSectionRepository.findOne({
      where: {
        id: sectionId,
        menu: { store: { id: storeId } },
      },
    });

    if (!menuSection) {
      throw new NotFoundException(
        `Menu Section with ID "${sectionId}" not found`,
      );
    }

    return menuSection;
  }

  async update(
    storeId: string,
    sectionId: string,
    updateMenuSectionDto: UpdateMenuSectionDto,
  ): Promise<MenuSection> {
    const menuSection = await this.findOne(storeId, sectionId);

    const updatedSection = this.menuSectionRepository.merge(
      menuSection,
      updateMenuSectionDto,
    );

    return this.menuSectionRepository.save(updatedSection);
  }

  async remove(storeId: string, sectionId: string): Promise<void> {
    const menuSection = await this.findOne(storeId, sectionId);
    await this.menuSectionRepository.remove(menuSection);
  }

  async updateOrder(
    storeId: string,
    menuId: string,
    orderedSectionIds: string[],
  ): Promise<void> {
    await this.menuService.findOne(storeId, menuId);

    const menuSections = await this.menuSectionRepository.find({
      where: {
        id: In(orderedSectionIds),
        menu: { id: menuId },
      },
    });

    if (menuSections.length !== orderedSectionIds.length) {
      throw new NotFoundException('One or more section IDs are invalid.');
    }

    const updatedSections = menuSections.map((section) => {
      const newOrder = orderedSectionIds.indexOf(section.id);
      return { ...section, displayOrder: newOrder };
    });

    await this.menuSectionRepository.save(updatedSections);
  }

  private async getNextDisplayOrder(menuId: string): Promise<number> {
    const lastSection = await this.menuSectionRepository.findOne({
      where: { menu: { id: menuId } },
      order: { displayOrder: 'DESC' },
    });

    return lastSection ? lastSection.displayOrder + 1 : 0;
  }
}
