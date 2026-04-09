import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto } from '../dtos/menus/create-menu.dto';
import { UpdateMenuDto } from '../dtos/menus/update-menu.dto';
import { Menu } from '../entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly repo: Repository<Menu>,
  ) {}

  async create(storeId: string, dto: CreateMenuDto): Promise<Menu> {
    const menu = this.repo.create({
      ...dto,
      storeId,
      store: { id: storeId },
    });

    return this.repo.save(menu);
  }

  async findAll(storeId: string): Promise<Menu[]> {
    return this.repo.find({
      where: { storeId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(storeId: string, menuId: string): Promise<Menu> {
    const menu = await this.repo.findOne({
      where: { id: menuId, store: { id: storeId } },
    });

    if (!menu) {
      throw new NotFoundException(`Menu "${menuId}" not found`);
    }

    return menu;
  }

  async update(
    storeId: string,
    menuId: string,
    dto: UpdateMenuDto,
  ): Promise<Menu> {
    const menu = await this.findOne(storeId, menuId);

    const updated = this.repo.merge(menu, dto);

    return this.repo.save(updated);
  }

  async remove(storeId: string, menuId: string): Promise<void> {
    await this.findOne(storeId, menuId);
    await this.repo.delete(menuId);
  }

  async activate(storeId: string, menuId: string): Promise<Menu> {
    return this.updateStatus(storeId, menuId, true);
  }

  async deactivate(storeId: string, menuId: string): Promise<Menu> {
    return this.updateStatus(storeId, menuId, false);
  }

  private async updateStatus(
    storeId: string,
    menuId: string,
    isActive: boolean,
  ): Promise<Menu> {
    const menu = await this.findOne(storeId, menuId);

    if (menu.isActive === isActive) {
      throw new ConflictException(
        `Menu already ${isActive ? 'active' : 'inactive'}`,
      );
    }

    menu.isActive = isActive;

    return this.repo.save(menu);
  }
}
