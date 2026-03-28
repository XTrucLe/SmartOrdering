import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';
import { TableStatus } from '../../constants/table.constant';
import { Exclude, Expose } from 'class-transformer';
import { ZoneResponseDto } from '../zones/zone.dto';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
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
export class TableGroupByZoneDto {
  @Expose() zone: ZoneResponseDto;
  @Expose() tables: TableResponseDto[];
}
