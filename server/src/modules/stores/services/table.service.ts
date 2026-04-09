import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { CreateTableDto, UpdateTableDto } from '../dtos/tables/table.dto';
import { ZonesService } from './zone.service';
import { randomInt } from 'crypto';
import { TableStatus, ValidTableStatusTransitions } from '../constants/table.constant';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly zonesService: ZonesService,
  ) {}

  async createTable(storeId: string, dto: CreateTableDto): Promise<Table> {
    await this.zonesService.getZoneById(storeId, dto.zoneId);
    const count = await this.countTablesInZone(storeId, dto.zoneId);

    for (let i = 0; i < 5; i++) {
      try {
        const table = this.tableRepository.create({
          ...dto,
          code: this.generateCode(),
          zoneId: dto.zoneId,
          storeId,
          sortOrder: count + 1,
        });

        return await this.tableRepository.save(table);
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === '23505') {
          continue;
        }
        throw error;
      }
    }
    // khá hiếm nhưng vẫn có khả năng xảy ra, nên sẽ thử lại 5 lần trước khi ném lỗi.
    // Nếu vẫn không thành công thì mới ném lỗi.
    throw new InternalServerErrorException('Failed to generate unique code');
  }

  async updateTable(storeId: string, tableId: string, dto: UpdateTableDto): Promise<Table> {
    const table = await this.getTableById(storeId, tableId);

    Object.assign(table, dto);
    return this.tableRepository.save(table);
  }

  async changeTableStatus(storeId: string, tableId: string, status: TableStatus): Promise<Table> {
    const table = await this.getTableById(storeId, tableId);
    if (table.status === status)
      throw new BadRequestException('Table is already in the desired status');

    const allowTransitions = ValidTableStatusTransitions[table.status] || [];
    if (!allowTransitions.includes(status)) {
      throw new BadRequestException(
        'Invalid status transition from ' + table.status + ' to ' + status,
      );
    }
    table.status = status;
    return this.tableRepository.save(table);
  }

  async getTableById(storeId: string, id: string): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: { id, storeId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  async getTablesInZone(storeId: string, zoneId: string): Promise<Table[]> {
    return this.tableRepository.find({
      where: { zoneId, storeId },
      order: { sortOrder: 'ASC' },
    });
  }

  async getTablesInStore(storeId: string): Promise<Table[]> {
    return this.tableRepository.find({
      where: { storeId },
      order: { sortOrder: 'ASC' },
      relations: ['zone'],
      select: {
        id: true,
        code: true,
        name: true,
        capacity: true,
        status: true,
        createdAt: true,
        zone: {
          id: true,
          name: true,
        },
      },
    });
  }

  async reorderTables(storeId: string, zoneId: string, orderedIds: string[]): Promise<Table[]> {
    const tables = await this.getTablesInZone(storeId, zoneId);

    if (tables.length !== orderedIds.length) {
      throw new BadRequestException('Invalid table order provided or missing tables');
    }

    const tablesMap = new Map(tables.map((t) => [t.id, t]));

    const updatedTables: Table[] = [];

    for (let i = 0; i < orderedIds.length; i++) {
      const table = tablesMap.get(orderedIds[i]);

      if (!table) {
        throw new BadRequestException('Invalid table id');
      }
      table.sortOrder = i + 1;
      updatedTables.push(table);
    }

    return this.tableRepository.manager.transaction(async (manager) => {
      await manager.save(updatedTables);
      return updatedTables;
    });
  }

  async getTableByCode(storeId: string, code: string): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: { storeId, code },
    });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  async deleteTable(storeId: string, tableId: string): Promise<void> {
    await this.getTableById(storeId, tableId);
    await this.tableRepository.delete(tableId);
  }

  private generateCode(length = 8): string {
    return Array.from({ length }, () => randomInt(0, 36).toString(36).toUpperCase()).join('');
  }

  private async countTablesInZone(storeId: string, zoneId: string): Promise<number> {
    return this.tableRepository.count({
      where: { zoneId, storeId },
    });
  }
}
