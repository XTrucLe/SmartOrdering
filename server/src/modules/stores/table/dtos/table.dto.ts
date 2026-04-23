import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { TableStatus } from '../../common/constants/table.constant';
import { Exclude, Expose } from 'class-transformer';
import { ZoneResponseDto } from '../../zone/dtos/zone.dto';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  zoneId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  capacity: number;
}

export class UpdateTableDto extends PartialType(CreateTableDto) {}

@Exclude()
export class TableResponseDto {
  @Expose() id: string;
  @Expose() code: string;
  @Expose() name: string;
  @Expose() capacity: number;
  @Expose() status: TableStatus;
  @Expose() createdAt: Date;
}

@Exclude()
export class TableGroupByZoneDto extends ZoneResponseDto {
  @Expose() tables: TableResponseDto[];
}
