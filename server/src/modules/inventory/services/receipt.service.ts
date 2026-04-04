import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from '../entities/receipt.entity';
import { ReceiptItem } from '../entities/receipt-item.entity';
import {
  CreateReceiptDto,
  ReceiptItemDto,
  UpdateReceiptDto,
} from '../dtos/receipt.dto';
import { IngredientService } from './ingredient.service';
import { Pages } from '@/common/interfaces/page.interface';
import { BaseService } from '@/common/services/base.service';
import { StockService } from './stock.service';

@Injectable()
export class ReceiptService extends BaseService<Receipt> {
  constructor(
    @InjectRepository(Receipt)
    repository: Repository<Receipt>,
    private readonly ingredientService: IngredientService,
    private readonly stockService: StockService,
    private readonly datasource: DataSource,
  ) {
    super(repository, Receipt);
  }

  async createReceipt(
    storeId: string,
    createDto: CreateReceiptDto,
  ): Promise<Receipt> {
    const receiptCode = await this.generateReceiptCode(storeId);

    const { items, ...receiptData } = createDto;

    return this.datasource.transaction(async (manager) => {
      const receipt = manager.create(Receipt, {
        ...receiptData,
        storeId,
        store: { id: storeId },
        code: receiptCode,
        totalCost: items.reduce(
          (total, item) => total + item.quantity * item.unitCost,
          0,
        ),
      });

      const savedReceipt = await manager.save(Receipt, receipt);

      const newReceiptItems = await this.createReceiptItems(
        storeId,
        savedReceipt.id,
        items,
        manager,
      );

      for (const item of newReceiptItems) {
        await this.stockService.increaseStock(
          item.ingredientId,
          item.quantity,
          `Receipt ${savedReceipt.code} - ${item.ingredient.name} - ${item.quantity} ${item.ingredient.importUnit}(s) added to stock`,
        );
      }

      savedReceipt.items = newReceiptItems;

      return savedReceipt;
    });
  }

  async findAll(storeId: string): Promise<Receipt[]> {
    return this.getRepo().find({ where: { storeId } });
  }

  async findOne(storeId: string, id: string): Promise<Receipt | null> {
    return this.getRepo().findOne({ where: { id, storeId } });
  }

  async findByCode(storeId: string, code: string): Promise<Receipt | null> {
    return this.getRepo().findOne({ where: { code, storeId } });
  }

  async getReceipt(storeId: string, id: string): Promise<Receipt> {
    const receipt = await this.findOne(storeId, id);
    if (!receipt) {
      throw new NotFoundException(`Receipt ${id} not found`);
    }
    return receipt;
  }

  async getReceipts(
    storeId: string,
    date: Date = new Date(),
    page: number = 1,
    limit: number = 10,
  ): Promise<Pages<Receipt>> {
    return this.paginate({ storeId, createdAt: date }, page, limit);
  }

  async update(
    storeId: string,
    id: string,
    updateDto: UpdateReceiptDto,
  ): Promise<Receipt | null> {
    const receipt = await this.findOne(storeId, id);
    if (!receipt) {
      return null;
    }
    Object.assign(receipt, updateDto);
    return this.getRepo().save(receipt);
  }

  async delete(storeId: string, id: string): Promise<void> {
    await this.getReceipt(storeId, id);
    await this.getRepo().delete({ id, storeId });
  }

  private async createReceiptItems(
    storeId: string,
    receiptId: string,
    items: ReceiptItemDto[],
    manager: EntityManager,
  ): Promise<ReceiptItem[]> {
    const ingredientList = await this.ingredientService.getListIngredientsByIds(
      storeId,
      items.map((i) => i.ingredientId),
    );

    const ingredientMap = new Map(ingredientList.map((i) => [i.id, i]));

    const receiptItems = items.map((item) => {
      const ingredient = ingredientMap.get(item.ingredientId);
      if (!ingredient) {
        throw new NotFoundException(
          `Ingredient ${item.ingredientId} not found`,
        );
      }

      return manager.create(ReceiptItem, {
        receiptId,
        receipt: { id: receiptId },
        ingredientId: item.ingredientId,
        ingredient,
        quantity: item.quantity,
        unitCost: item.unitCost,
        totalCost: item.quantity * item.unitCost,
      });
    });

    return manager.save(ReceiptItem, receiptItems);
  }

  private async generateReceiptCode(storeId: string): Promise<string> {
    const preCode = this.preCode();

    const lastReceipt = await this.getRepo().findOne({
      where: { storeId, code: Like(`${preCode}%`) },
      order: { createdAt: 'DESC' },
      select: ['code'],
    });

    if (!lastReceipt) {
      return preCode + '00001';
    }

    const lastCode = lastReceipt.code;
    const lastNumber = parseInt(lastCode.slice(-5), 10);
    const newNumber = (lastNumber + 1).toString().padStart(5, '0');
    const newCode = preCode + newNumber;

    return newCode;
  }

  private preCode(): string {
    const preCode = new Date();
    const year = preCode.getFullYear().toString();
    const month = (preCode.getMonth() + 1).toString().padStart(2, '0');
    const day = preCode.getDate().toString().padStart(2, '0');
    return `${day}${month}${year}`;
  }
}
