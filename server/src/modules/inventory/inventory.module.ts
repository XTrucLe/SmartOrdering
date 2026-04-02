import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientService } from './services/ingredient.service';
import { IngredientController } from './controllers/ingredient.controller';
import { ReceiptItem } from './entities/receipt-item.entity';
import { Receipt } from './entities/receipt.entity';
import { ReceiptController } from './controllers/receipt.controller';
import { ReceiptService } from './services/receipt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, Receipt, ReceiptItem])],
  controllers: [IngredientController, ReceiptController],
  providers: [IngredientService, ReceiptService],
  exports: [IngredientService, ReceiptService],
})
export class InventoryModule {}
