import { Exclude, Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateDeliveryDto {

    @IsString()
    @IsNotEmpty()
    streetAddress: string;

    @IsString()
    @IsNotEmpty()
    ward: string;

    @IsString()
    @IsNotEmpty()
    district: string;

    @IsString()
    @IsNotEmpty()
    province: string;
}

@Exclude()
export class DeliveryResponseDto {
    @Expose() receiverName: string;
    @Expose() receiverPhone: string;
    @Expose() streetAddress: string;
    @Expose() ward: string;
    @Expose() district: string;
    @Expose() province: string;
    @Expose() status: string;
    @Expose() shipperName: string;
    @Expose() shipperPhone: string;
}