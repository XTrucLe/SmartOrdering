import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entities/menu.entity';
import { CreateMenuDto } from '../dtos/menus/create-menu.dto';
import { UpdateMenuDto } from '../dtos/menus/update-menu.dto';
import { StoresService } from '../../stores/stores.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly storesService: StoresService,
  ) {}

  async createMenu(
    storeId: string,
    createMenuDto: CreateMenuDto,
  ): Promise<Menu> {
    const store = await this.storesService.getStoreById(storeId);

    const menu = this.menuRepository.create({
      ...createMenuDto,
      store,
    });

    return this.menuRepository.save(menu);
  }

  async getMenuById(
    storeId: string,
    menuId: string,
    includeSections = false,
  ): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id: menuId, store: { id: storeId } },
      relations: includeSections
        ? {
            menuSections: {
              menuItems: true,
            },
          }
        : undefined,
      order: includeSections
        ? {
            menuSections: {
              displayOrder: 'ASC',
              menuItems: {
                displayOrder: 'ASC',
              },
            },
          }
        : undefined,
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  async getMenusByStore(
    storeId: string,
    includeSections = false,
  ): Promise<Menu[]> {
    return this.menuRepository.find({
      where: { store: { id: storeId } },
      relations: includeSections
        ? {
            menuSections: {
              menuItems: true,
            },
          }
        : undefined,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateMenu(
    storeId: string,
    menuId: string,
    updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    const menu = await this.getMenuById(storeId, menuId);

    this.menuRepository.merge(menu, updateMenuDto);

    return this.menuRepository.save(menu);
  }

  async deleteMenu(storeId: string, menuId: string): Promise<void> {
    await this.getMenuById(storeId, menuId);
    await this.menuRepository.delete({ id: menuId });
  }

  async updateMenuStatus(
    storeId: string,
    menuId: string,
    isActive: boolean,
  ): Promise<Menu> {
    const menu = await this.getMenuById(storeId, menuId);

    if (menu.isActive === isActive) {
      throw new ConflictException(
        `Menu is already ${isActive ? 'active' : 'inactive'}`,
      );
    }

    menu.isActive = isActive;
    return this.menuRepository.save(menu);
  }
}
