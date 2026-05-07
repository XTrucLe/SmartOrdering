import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from '../entities/section.entity';
import { CreateSectionDto } from '../dtos/sections/create-section.dto';
import { UpdateSectionDto } from '../dtos/sections/update-section.dto';
import { MenuService } from './menu.service';
import { DataSource } from 'typeorm';
import { SectionItemService } from './section-item.service';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
    private readonly menuService: MenuService,
    private readonly sectionItemService: SectionItemService,
    private readonly datasource: DataSource,
  ) {}

  async create(storeId: string, menuId: string, dto: CreateSectionDto): Promise<Section> {
    await this.menuService.findOne(storeId, menuId);

    return this.datasource.transaction(async (manager) => {
      try {
        const sectionRepo = manager.getRepository(Section);

        const section = sectionRepo.create({ ...dto, menuId });
        const savedSection = await sectionRepo.save(section);

        if (dto.items && dto.items.length > 0) {
          const newItems = await Promise.all(
            dto.items.map((itemDto) =>
              this.sectionItemService.create(storeId, savedSection.id, itemDto, manager),
            ),
          );
          savedSection.sectionItems = newItems;
        }
        return savedSection;
      } catch (error) {
        throw new ConflictException('Failed to create section with items, cause: ', error.message);
      }
    });
  }

  async getAllByMenu(storeId: string, menuId: string): Promise<Section[]> {
    await this.menuService.findOne(storeId, menuId);
    return this.repo.find({ where: { menuId }, order: { displayOrder: 'ASC' } });
  }

  async getAllByStore(storeId: string): Promise<Section[]> {
    return this.repo
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.menu', 'menu')
      .leftJoinAndSelect('section.sectionItems', 'sectionItems')
      .where('menu.storeId = :storeId', { storeId })
      .orderBy('section.displayOrder', 'ASC')
      .getMany();
  }

  async getSectionById(storeId: string, sectionId: string): Promise<Section> {
    const section = await this.repo.findOne({
      where: { id: sectionId },
      relations: ['menu'],
    });

    if (!section) {
      throw new NotFoundException(`Section "${sectionId}" not found`);
    }

    if (section.menu.storeId !== storeId) {
      throw new NotFoundException(`Section "${sectionId}" not found in your store`);
    }

    return section;
  }

  async update(storeId: string, sectionId: string, dto: UpdateSectionDto): Promise<Section> {
    const section = await this.getSectionById(storeId, sectionId);
    const updated = this.repo.merge(section, dto);
    return this.repo.save(updated);
  }

  async reOrder(storeId: string, menuId: string, sectionIds: string[]): Promise<void> {
    const sections = await this.getAllByMenu(storeId, menuId);
    const sectionMap = new Map(sections.map((s) => [s.id, s]));

    const updatedSections = sectionIds.map((id, index) => {
      const section = sectionMap.get(id);
      if (!section) {
        throw new NotFoundException(`Section "${id}" not found in menu "${menuId}"`);
      }
      return { ...section, displayOrder: index };
    });

    await this.repo.save(updatedSections);
  }

  async remove(storeId: string, sectionId: string): Promise<void> {
    const section = await this.getSectionById(storeId, sectionId);
    await this.repo.remove(section);
  }
}
