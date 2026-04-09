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
    private readonly repo: Repository<MenuSection>,
    private readonly menuService: MenuService,
  ) {}

  async create(storeId: string, menuId: string, dto: CreateMenuSectionDto): Promise<MenuSection> {
    const menu = await this.menuService.findOne(storeId, menuId);

    const displayOrder = dto.displayOrder ?? (await this.getNextDisplayOrder(menuId));

    const section = this.repo.create({
      ...dto,
      menuId,
      menu,
      displayOrder,
    });

    return this.repo.save(section);
  }

  async findAllByMenu(storeId: string, menuId: string): Promise<MenuSection[]> {
    await this.menuService.findOne(storeId, menuId);

    return this.repo.find({
      where: { menuId },
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(storeId: string, sectionId: string): Promise<MenuSection> {
    const section = await this.repo.findOne({
      where: {
        id: sectionId,
        menu: { store: { id: storeId } },
      },
    });

    if (!section) {
      throw new NotFoundException(`MenuSection "${sectionId}" not found`);
    }

    return section;
  }

  async update(
    storeId: string,
    sectionId: string,
    dto: UpdateMenuSectionDto,
  ): Promise<MenuSection> {
    const section = await this.findOne(storeId, sectionId);

    const updated = this.repo.merge(section, dto);

    return this.repo.save(updated);
  }

  async remove(storeId: string, sectionId: string): Promise<void> {
    const section = await this.findOne(storeId, sectionId);
    await this.repo.remove(section);
  }

  async updateOrder(storeId: string, menuId: string, orderedIds: string[]): Promise<void> {
    await this.menuService.findOne(storeId, menuId);

    const sections = await this.repo.find({
      where: {
        id: In(orderedIds),
        menuId,
      },
    });

    if (sections.length !== orderedIds.length) {
      throw new NotFoundException('Invalid sectionIds');
    }

    const orderMap = new Map(orderedIds.map((id, index) => [id, index]));

    const updated = sections.map((section) => ({
      ...section,
      displayOrder: orderMap.get(section.id)!,
    }));

    await this.repo.save(updated);
  }

  private async getNextDisplayOrder(menuId: string): Promise<number> {
    const last = await this.repo.findOne({
      where: { menuId },
      order: { displayOrder: 'DESC' },
    });

    return last ? last.displayOrder + 1 : 0;
  }
}
