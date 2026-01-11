import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../menus/entities/menu.entity';
import { CreateMenuDto } from './dtos/create-menu.dto';
import { MenuStatus } from './constants/menu.constant';
import { UpdateMenuDto } from './dtos/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async createMenu(storeId: string, dto: CreateMenuDto): Promise<Menu> {
    const { name } = dto;
    const existingMenu = await this.menuRepository.findOne({
      where: { name, store: { id: storeId } },
    });
    if (existingMenu) {
      throw new ConflictException(`Menu with name ${name} already exists.`);
    }
    const newMenu = this.menuRepository.create({
      ...dto,
      store: { id: storeId },
    });
    return this.menuRepository.save(newMenu);
  }

  async getMenus(storeId: string): Promise<Menu[]> {
    return this.menuRepository.find({
      where: { store: { id: storeId } },
      relations: ['items'],
    });
  }

  async getMenuById(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found.`);
    }
    return menu;
  }

  async updateMenu(id: string, dto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.getMenuById(id);
    Object.assign(menu, dto);
    return this.menuRepository.save(menu);
  }

  async deleteMenu(id: string): Promise<void> {
    const menu = await this.getMenuById(id);
    await this.menuRepository.remove(menu);
  }

  async disableMenu(id: string): Promise<Menu> {
    const menu = await this.getMenuById(id);
    menu.status = MenuStatus.INACTIVE;
    return this.menuRepository.save(menu);
  }
}
