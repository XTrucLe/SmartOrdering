import { PartialType } from "@nestjs/mapped-types";
import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateComboItemDto {
    @IsString()
    productId: string;

    @IsString()
    quantity: number;

    @IsString()
    price: number;
}

export class CreateComboDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    imageUrl: string;

    @IsString()
    basePrice: number;

    @IsString()
    discountedPrice: number;

    @IsString()
    quantityLimit: number;

    @IsString()
    validFrom: Date;

    @IsString()
    validTo: Date;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateComboItemDto)
    comboItems: CreateComboItemDto[];
}

export class UpdateComboDto extends PartialType(CreateComboDto) { }

@Exclude()
export class ComboItemDto {
    @Expose() id: string;
    @Expose() comboId: string;
    @Expose() productId: string;
    @Expose() productName: string;
    @Expose() productImageUrl: string;
    @Expose() productUnit: string;
    @Expose() quantity: number;
    @Expose() price: number;
}

@Exclude()
export class ComboDto {
    @Expose() id: string;
    @Expose() storeId: string;
    @Expose() name: string;
    @Expose() description: string;
    @Expose() displayOrder: number;
    @Expose() isActive: boolean;
    @Expose() imageUrl: string;
    @Expose() basePrice: number;
    @Expose() discountedPrice: number;

    @Expose() quantityLimit: number;
    @Expose() soldQty: number;
    @Expose() validFrom: Date;
    @Expose() validTo: Date;
    @Expose() createdAt: Date;
    @Expose()
    @Type(() => ComboItemDto)
    comboItems: ComboItemDto[];
}