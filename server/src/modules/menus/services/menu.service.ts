import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { StoresService } from '../../stores/stores.service';
import { CreateMenuDto } from '../dtos/menus/create-menu.dto';
import { UpdateMenuDto } from '../dtos/menus/update-menu.dto';
import { Menu } from '../entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly storesService: StoresService,
  ) {}

  async create(storeId: string, createMenuDto: CreateMenuDto): Promise<Menu> {
    const store = await this.storesService.getStoreById(storeId);
    const menu = this.menuRepository.create({
      ...createMenuDto,
      store,
    });
    return this.menuRepository.save(menu);
  }

  async findAll(storeId: string, withRelations = false): Promise<Menu[]> {
    const options: FindManyOptions<Menu> = {
      where: { store: { id: storeId } },
      order: { createdAt: 'DESC' },
    };

    if (withRelations) {
      options.relations = { menuSections: { menuItems: true } };
      options.order = {
        ...options.order,
        menuSections: { displayOrder: 'ASC' },
      };
    }

    return this.menuRepository.find(options);
  }

  async findOne(
    storeId: string,
    menuId: string,
    withRelations = false,
  ): Promise<Menu> {
    const menu = await this.findMenuByStore(storeId, menuId, withRelations);
    if (!menu) {
      throw new NotFoundException(`Menu with ID "${menuId}" not found`);
    }
    return menu;
  }

  async update(
    storeId: string,
    menuId: string,
    updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    const menu = await this.findOne(storeId, menuId);
    const updatedMenu = this.menuRepository.merge(menu, updateMenuDto);
    return this.menuRepository.save(updatedMenu);
  }

  async remove(storeId: string, menuId: string): Promise<void> {
    await this.findOne(storeId, menuId);
    await this.menuRepository.delete(menuId);
  }

  async updateStatus(
    storeId: string,
    menuId: string,
    isActive: boolean,
  ): Promise<Menu> {
    const menu = await this.findOne(storeId, menuId);
    if (menu.isActive === isActive) {
      throw new ConflictException(
        `Menu is already ${isActive ? 'active' : 'inactive'}.`,
      );
    }
    menu.isActive = isActive;
    return this.menuRepository.save(menu);
  }

  private async findMenuByStore(
    storeId: string,
    menuId: string,
    withRelations: boolean,
  ): Promise<Menu | null> {
    const options: FindOneOptions<Menu> = {
      where: { id: menuId, store: { id: storeId } },
    };

    if (withRelations) {
      options.relations = { menuSections: { menuItems: { item: true } } };
      options.order = {
        menuSections: {
          displayOrder: 'ASC',
          menuItems: { displayOrder: 'ASC' },
        },
      };
    }

    return this.menuRepository.findOne(options);
  }
}
