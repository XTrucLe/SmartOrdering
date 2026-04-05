import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientService } from './services/ingredient.service';
import { IngredientController } from './controllers/ingredient.controller';
import { Stock } from './entities/stock.entity';
import { Receipt } from './entities/receipt.entity';
import { ReceiptItem } from './entities/receipt-item.entity';
import { ReceiptController } from './controllers/receipt.controller';
import { ReceiptService } from './services/receipt.service';
import { StockService } from './services/stock.service';
import { StockLog } from './entities/stock-log.entity';
import { StockLogService } from './services/stock-log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ingredient,
      Stock,
      Receipt,
      ReceiptItem,
      StockLog,
    ]),
  ],
  controllers: [IngredientController, ReceiptController],
  providers: [IngredientService, ReceiptService, StockService, StockLogService],
  exports: [IngredientService, ReceiptService, StockService, StockLogService],
})
export class InventoryModule {}
