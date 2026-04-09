import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Combo } from '../entities/combo.entity';
import { ComboItem } from '../entities/combo-item.entity';
import { CreateComboDto, UpdateComboDto } from '../dtos/combo.dto';
import { ProductService } from './product.service';

@Injectable()
export class ComboService {
  constructor(
    @InjectRepository(Combo)
    private readonly comboRepository: Repository<Combo>,
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
  ) {}

  async createCombo(storeId: string, createComboDto: CreateComboDto): Promise<Combo> {
    const { comboItems, ...comboData } = createComboDto;

    return await this.dataSource.transaction(async (manager) => {
      const combo = manager.create(Combo, { ...comboData, storeId });
      const savedCombo = await manager.save(combo);

      if (comboItems && comboItems.length > 0) {
        const itemsToSave = await Promise.all(
          comboItems.map(async (item) => {
            const product = await this.productService.getProductById(storeId, item.productId);

            return manager.create(ComboItem, {
              ...item,
              productId: product.id,
              productName: product.name,
              productImageUrl: product.imageUrl,
              productUnit: product.unit,
              comboId: savedCombo.id,
            });
          }),
        );
        savedCombo.comboItems = await manager.save(ComboItem, itemsToSave);
      }

      return savedCombo;
    });
  }

  async findAll(storeId: string): Promise<Combo[]> {
    return await this.comboRepository.find({
      where: { storeId, isActive: true },
      relations: ['comboItems'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(storeId: string, comboId: string): Promise<Combo> {
    const combo = await this.comboRepository.findOne({
      where: { id: comboId, storeId, isActive: true },
      relations: ['comboItems'],
    });

    if (!combo) {
      throw new NotFoundException(`Combo ${comboId} not found in store ${storeId}`);
    }
    return combo;
  }

  async checkComboAvailability(storeId: string, comboId: string): Promise<boolean> {
    const combo = await this.findOne(storeId, comboId);
    return combo.isValidNow();
  }

  async updateCombo(
    storeId: string,
    comboId: string,
    updateComboDto: UpdateComboDto,
  ): Promise<Combo> {
    const { comboItems, ...comboData } = updateComboDto;

    const combo = await this.findOne(storeId, comboId);

    return await this.dataSource.transaction(async (manager) => {
      manager.merge(Combo, combo, comboData);
      const updatedCombo = await manager.save(combo);

      if (comboItems) {
        await manager.delete(ComboItem, { comboId: combo.id });

        const newItems = await Promise.all(
          comboItems.map(async (item) => {
            const product = await this.productService.getProductById(storeId, item.productId);
            return manager.create(ComboItem, {
              ...item,
              productId: product.id,
              productName: product.name,
              productImageUrl: product.imageUrl,
              productUnit: product.unit,
              comboId: combo.id,
            });
          }),
        );
        updatedCombo.comboItems = await manager.save(ComboItem, newItems);
      }

      return updatedCombo;
    });
  }

  async handlePurchase(storeId: string, comboId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero.');
    }

    const combo = await this.findOne(storeId, comboId);

    if (combo.isSoldOut()) {
      throw new UnprocessableEntityException(`Combo is sold out and cannot be purchased.`);
    }

    await this.dataSource.transaction(async (manager) => {
      const currentCombo = await manager.findOne(Combo, {
        where: { id: combo.id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!currentCombo) {
        throw new NotFoundException(`Combo ${comboId} not found in store ${storeId}`);
      }

      if (currentCombo.isSoldOut()) {
        throw new UnprocessableEntityException(`Combo is sold out and cannot be purchased.`);
      }

      const result = await manager
        .createQueryBuilder()
        .update(Combo)
        .set({
          soldQty: () => `"sold_qty" + ${quantity}`,
          isActive: () =>
            `CASE WHEN quantity_limit != -1 AND sold_qty + ${quantity} >= quantity_limit THEN false ELSE is_active END`,
        })
        .where('id = :id', { id: combo.id })
        .andWhere('quantity_limit = -1 OR sold_qty + :quantity <= quantity_limit', { quantity })
        .execute();

      if (result.affected === 0) {
        throw new UnprocessableEntityException(
          `Cannot purchase Combo ${comboId} in store ${storeId}, possibly due to quantity exceeding limit or Combo being sold out.`,
        );
      }
    });
  }

  async deleteCombo(storeId: string, comboId: string): Promise<void> {
    const combo = await this.findOne(storeId, comboId);

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(ComboItem, { comboId: combo.id });
      const result = await manager.delete(Combo, {
        id: combo.id,
        storeId,
        isActive: true,
      });

      if (result.affected === 0) {
        throw new UnprocessableEntityException(`Cannot delete Combo`);
      }
    });
  }

  async toggleStatus(storeId: string, comboId: string): Promise<Combo> {
    const combo = await this.findOne(storeId, comboId);
    combo.isActive = !combo.isActive;
    return await this.comboRepository.save(combo);
  }
}
