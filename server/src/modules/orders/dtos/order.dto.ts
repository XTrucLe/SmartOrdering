import { Exclude, Expose, Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto, OrderItemResponseDto } from './order-item.dto';
import { DeliveryMethod, OrderStatus, PaymentStatus } from '../constants/order.constant';
import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryDto } from './delivery.dto';

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @IsEnum(DeliveryMethod)
    @IsOptional()
    deliveryMethod: DeliveryMethod;

    @IsNotEmpty()
    @IsString()
    customerName: string;

    @IsPhoneNumber('VN')
    @IsNotEmpty()
    customerPhone: string;

    @IsString()
    @IsOptional()
    tableId?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    deliveryFee?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    tip?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    discount?: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @ValidateNested()
    @Type(() => CreateDeliveryDto)
    delivery: CreateDeliveryDto;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) { }

export class OrderFilterDto {
    @IsNumber()
    @Min(0)
    @IsOptional()
    page?: number;

    @IsNumber()
    @Min(1)
    @IsOptional()
    limit?: number;

    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @IsEnum(PaymentStatus)
    @IsOptional()
    paymentStatus?: PaymentStatus;

    @IsEnum(DeliveryMethod)
    @IsOptional()
    deliveryMethod?: DeliveryMethod;

    @IsString()
    @IsOptional()
    search?: string;

    @IsOptional()
    @Type(() => Date)
    startDate?: string;

    @IsOptional()
    @Type(() => Date)
    endDate?: string;
}

@Exclude()
export class OrderResponseDto {
    @Expose() id: string;
    @Expose() storeId: string;
    @Expose() customerName: string;
    @Expose() customerPhone: string;
    @Expose() customerAddress: string;
    @Expose() status: OrderStatus;
    @Expose() paymentStatus: PaymentStatus;
    @Expose() deliveryMethod: DeliveryMethod;
    @Expose() tableId: string;
    @Expose() tableName: number;
    @Expose() notes: string;
    @Expose() subTotal: number;
    @Expose() tax: number;
    @Expose() deliveryFee: number;
    @Expose() grandTotal: number;

    @Expose()
    @Type(() => OrderItemResponseDto)
    orderItems: OrderItemResponseDto[];

    @Expose() createdAt: Date;
    @Expose() updatedAt: Date;
}
