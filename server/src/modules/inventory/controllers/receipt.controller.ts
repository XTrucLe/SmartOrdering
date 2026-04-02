import { JwtGuard } from '@/modules/auth/guards/jwt.guard';
import { StoreRoleGuard } from '@/modules/stores/guards/store-role.guard';
import { Body, Controller, Get, UseGuards, Post, Param } from '@nestjs/common';
import { ReceiptService } from '../services/receipt.service';
import { CurrentStore } from '@/modules/stores/decorators/current-store.decorator';
import { StoreInfo } from '@/modules/stores/dtos/stores/store-info.dto';
import { CreateReceiptDto, ReceiptResponseDto } from '../dtos/receipt.dto';
import { ReceiptMapper } from '../mappers/rexceipt.mapper';
import { Pages } from '@/common/interfaces/page.interface';
import { StoreManager } from '@/modules/stores/decorators/store-role-group.decorator';

@Controller('receipts')
@UseGuards(JwtGuard, StoreRoleGuard)
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @StoreManager()
  async createReceipt(
    @CurrentStore() store: StoreInfo,
    @Body() dto: CreateReceiptDto,
  ): Promise<ReceiptResponseDto> {
    const receipt = await this.receiptService.createReceipt(store.id, dto);
    return ReceiptMapper.toDto(receipt);
  }

  @Get()
  @StoreManager()
  async getReceipts(
    @CurrentStore() store: StoreInfo,
  ): Promise<Pages<ReceiptResponseDto>> {
    const receipts = await this.receiptService.getReceipts(store.id);
    return {
      data: ReceiptMapper.toList(receipts.data),
      page: receipts.page,
      limit: receipts.limit,
      total: receipts.total,
    };
  }

  @Get(':id')
  @StoreManager()
  async getReceipt(
    @CurrentStore() store: StoreInfo,
    @Param('id') id: string,
  ): Promise<ReceiptResponseDto> {
    const receipt = await this.receiptService.getReceipt(store.id, id);
    return ReceiptMapper.toDto(receipt);
  }
}
