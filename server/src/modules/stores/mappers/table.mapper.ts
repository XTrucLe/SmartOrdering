import { plainToInstance } from 'class-transformer';
import { Table } from '../entities/table.entity';
import { TableGroupByZoneDto, TableResponseDto } from '../dtos/tables/table.dto';

export const toTableDto = (table: Table): TableResponseDto => {
  return plainToInstance(TableResponseDto, table, {
    excludeExtraneousValues: true,
  });
};

export const mapToTableGroupByZones = (tables: Table[]): TableGroupByZoneDto[] => {
  const zoneMap: Record<string, TableGroupByZoneDto> = {};
  tables.forEach((table) => {
    const zoneId = table.zone.id;
    if (!zoneMap[zoneId]) {
      zoneMap[zoneId] = {
        id: table.zone.id,
        name: table.zone.name,
        description: table.zone.description,
        createdAt: table.zone.createdAt,
        tables: [],
      };
    }
    zoneMap[zoneId].tables.push(toTableDto(table));
  });
  const result = Object.values(zoneMap);
  return result;
};

export const mapToTableDtos = (tables: Table[]): TableResponseDto[] => {
  return tables.map((table) =>
    plainToInstance(TableResponseDto, table, {
      excludeExtraneousValues: true,
    }),
  );
};
