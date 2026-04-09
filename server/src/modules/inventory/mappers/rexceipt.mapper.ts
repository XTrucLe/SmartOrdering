import { plainToInstance } from 'class-transformer';
import { Receipt } from '../entities/receipt.entity';
import { ReceiptItem } from '../entities/receipt-item.entity';
import { ReceiptResponseDto, ReceiptItemResponseDto } from '../dtos/receipt.dto';

export class ReceiptMapper {
  static toDto(receipt: Receipt): ReceiptResponseDto {
    return plainToInstance(
      ReceiptResponseDto,
      {
        ...receipt,
        storeName: receipt.store?.name,
        items: receipt.items?.map((item: ReceiptItem) =>
          plainToInstance(ReceiptItemResponseDto, {
            ...item,
            name: item.ingredient.name,
            unit: item.ingredient.importUnit,
          }),
        ),
      },
      { excludeExtraneousValues: true },
    );
  }

  static toList(receipts: Receipt[]): ReceiptResponseDto[] {
    if (!receipts) return [];
    return receipts.map((receipt) => this.toDto(receipt));
  }
}
