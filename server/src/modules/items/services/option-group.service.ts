import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { OptionGroup } from '../entities/option-group.entity';
import {
  CreateOptionDto,
  CreateOptionGroupDto,
  UpdateOptionGroupDto,
} from '../dtos/option-group.dto';
import { BaseService } from '@/common/services/base.service';
import { Option } from '../entities/option.entity';

@Injectable()
export class OptionGroupService extends BaseService<OptionGroup> {
  constructor(
    @InjectRepository(OptionGroup)
    private readonly groupRepo: Repository<OptionGroup>,

    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
  ) {
    super(groupRepo, OptionGroup);
  }

  async createGroup(
    storeId: string,
    itemId: string,
    dto: CreateOptionGroupDto,
    manager?: EntityManager,
  ): Promise<OptionGroup> {
    const repo = this.getRepo(manager);

    const existingGroup = await repo.findOne({
      where: {
        name: dto.name,
        item: { id: itemId, storeId },
      },
      select: ['id'],
    });

    if (existingGroup) {
      throw new ConflictException('Option group name already exists');
    }

    const group = repo.create({
      ...dto,
      item: { id: itemId },
      options: dto.options?.map((opt) => this.optionRepo.create({ ...opt })),
    });

    return repo.save(group);
  }

  async updateGroup(
    storeId: string,
    groupId: string,
    dto: UpdateOptionGroupDto,
    manager?: EntityManager,
  ): Promise<OptionGroup> {
    const repo = this.getRepo(manager);

    const group = await repo.findOne({
      where: {
        id: groupId,
        item: {
          storeId,
        },
      },
      relations: {
        item: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Option group not found');
    }

    Object.assign(group, dto);

    return repo.save(group);
  }

  async addOptionToGroup(
    storeId: string,
    groupId: string,
    option: CreateOptionDto,
  ): Promise<OptionGroup> {
    const group = await this.getGroupById(groupId);

    if (group.item.storeId !== storeId) {
      throw new NotFoundException('Option group not found');
    }
    const newOption = this.optionRepo.create({
      ...option,
      group: { id: groupId },
    });

    group.options.push(newOption);

    return this.groupRepo.save(group);
  }

  async deleteGroup(storeId: string, groupId: string, manager?: EntityManager): Promise<void> {
    const repo = this.getRepo(manager);

    const group = await repo.findOne({
      where: {
        id: groupId,
        item: { storeId },
      },
    });

    if (!group) {
      throw new NotFoundException('Option group not found');
    }

    await repo.remove(group);
  }

  async findAllByStore(storeId: string): Promise<OptionGroup[]> {
    return this.repository.find({
      where: {
        item: { storeId },
      },
      order: {
        displayOrder: 'ASC',
      },
      relations: {
        options: true,
      },
    });
  }

  async getGroupById(groupId: string, manager?: EntityManager): Promise<OptionGroup> {
    const repo = this.getRepo(manager);

    const group = await repo.findOne({
      where: { id: groupId },
      relations: {
        item: true,
        options: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Option group not found');
    }

    return group;
  }
}
