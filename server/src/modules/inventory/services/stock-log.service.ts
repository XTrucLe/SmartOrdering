import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockLog } from '../entities/stock-log.entity';

@Injectable()
export class StockLogService {
  constructor(
    @InjectRepository(StockLog)
    private readonly stockLogRepository: Repository<StockLog>,
  ) {}

  async createStockLog(logData: Partial<StockLog>): Promise<StockLog> {
    const newLog = this.stockLogRepository.create(logData);
    return this.stockLogRepository.save(newLog);
  }

  async getStockLogsByIngredientId(ingredientId: string): Promise<StockLog[]> {
    return this.stockLogRepository.find({
      where: { ingredientId },
      order: { createAt: 'DESC' },
    });
  }
}
