import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { StockLogService } from './stock-log.service';
import { StockLogType } from '../constants/stock.enum';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly stockLogService: StockLogService,
  ) {}

  async createStock(
    ingredientId: string,
    manager: EntityManager,
  ): Promise<Stock> {
    const newStock = manager
      .getRepository(Stock)
      .create({ ingredientId, quantity: 0 });
    return manager.getRepository(Stock).save(newStock);
  }

  async getStockByIngredientId(ingredientId: string): Promise<Stock> {
    const existingStock = await this.findStock(ingredientId);
    if (!existingStock) {
      throw new NotFoundException('Stock not found');
    }
    return existingStock;
  }

  async findStock(ingredientId: string): Promise<Stock | null> {
    return this.stockRepository.findOne({
      where: { ingredientId },
      relations: ['ingredient'],
    });
  }

  async increaseStock(
    ingredientId: string,
    quantity: number,
    note?: string,
  ): Promise<Stock> {
    if (quantity <= 0) {
      throw new ConflictException(
        'Quantity to increase must be greater than zero',
      );
    }
    const stock = await this.adjustStock(ingredientId, quantity);
    await this.stockLogService.createStockLog({
      ingredientId,
      ingredientName: stock.ingredient.name,
      prevQty:
        stock.quantity - quantity * parseFloat(stock.ingredient.conversionRate),
      newQty: stock.quantity,
      delta: quantity,
      type: StockLogType.IN,
      note,
    });
    return stock;
  }

  async decreaseStock(
    ingredientId: string,
    quantity: number,
    note?: string,
  ): Promise<Stock> {
    if (quantity <= 0) {
      throw new ConflictException(
        'Quantity to decrease must be greater than zero',
      );
    }
    const stock = await this.adjustStock(ingredientId, -quantity);
    await this.stockLogService.createStockLog({
      ingredientId,
      ingredientName: stock.ingredient.name,
      prevQty:
        stock.quantity + quantity * parseFloat(stock.ingredient.conversionRate),
      newQty: stock.quantity,
      delta: -quantity,
      type: StockLogType.OUT,
      note,
    });
    return stock;
  }

  private async adjustStock(
    ingredientId: string,
    delta: number,
  ): Promise<Stock> {
    const stockData = await this.stockRepository.findOne({
      where: { ingredient: { id: ingredientId } },
      relations: ['ingredient'],
    });

    if (!stockData) throw new NotFoundException('Stock not found');
    const conversionRate = parseFloat(stockData.ingredient.conversionRate) || 1;

    const result = await this.stockRepository
      .createQueryBuilder()
      .update(Stock)
      .set({
        quantity: () => `quantity + ${delta * conversionRate}`,
      })
      .where('ingredientId = :ingredientId', { ingredientId })
      .andWhere('quantity + :change >= 0', { change: delta * conversionRate })
      .execute();

    if (result.affected === 0) {
      throw new ConflictException('Insufficient stock or update failed');
    }

    return this.getStockByIngredientId(ingredientId);
  }
}
