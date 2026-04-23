import { PartialType } from '@nestjs/mapped-types';
import { IsObject, IsOptional } from 'class-validator';

export class CreateStoreConfigDto {
  @IsOptional()
  @IsObject()
  openingHours?: Record<string, { open: string; close: string }>;

  @IsOptional()
  @IsObject()
  theme?: Record<string, any>;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  flags?: {
    autoAcceptOrders?: boolean;
    autoAcceptPayments?: boolean;
  };
}

export class UpdateStoreConfigDto extends PartialType(CreateStoreConfigDto) {}

export class StoreConfigResponseDto {
  storeId: string;
  openingHours?: Record<string, { open: string; close: string }>;
  theme?: Record<string, any>;
  settings?: Record<string, any>;
  flags?: {
    autoAcceptOrders?: boolean;
    autoAcceptPayments?: boolean;
  };
}
