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
import {
  TableStatus,
  ValidTableStatusTransitions,
} from '../constants/table.constant';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly zonesService: ZonesService,
  ) {}

  async createTable(zoneId: string, dto: CreateTableDto): Promise<Table> {
    const zone = await this.zonesService.getZoneById(zoneId);

    for (let i = 0; i < 5; i++) {
      try {
        const table = this.tableRepository.create({
          ...dto,
          code: this.generateCode(),
          zoneId: zone.id,
          storeId: zone.storeId,
        });

        return await this.tableRepository.save(table);
      } catch (error) {
        if (
          error instanceof Error &&
          'code' in error &&
          error.code === '23505'
        ) {
          continue;
        }
        throw error;
      }
    }
    // khá hiếm nhưng vẫn có khả năng xảy ra, nên sẽ thử lại 5 lần trước khi ném lỗi.
    // Nếu vẫn không thành công thì mới ném lỗi.
    throw new InternalServerErrorException('Failed to generate unique code');
  }

  async updateTable(tableId: string, dto: UpdateTableDto): Promise<Table> {
    const table = await this.getTableById(tableId);

    Object.assign(table, dto);
    return this.tableRepository.save(table);
  }

  async changeTableStatus(
    tableId: string,
    status: TableStatus,
  ): Promise<Table> {
    const table = await this.getTableById(tableId);
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

  async getTableById(id: string): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: { id },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  async getTablesByZoneId(zoneId: string): Promise<Table[]> {
    return this.tableRepository.find({
      where: { zoneId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTablesByStoreId(storeId: string): Promise<Table[]> {
    return this.tableRepository.find({
      where: { storeId },
      order: { createdAt: 'DESC' },
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

  async getTableByCode(storeId: string, code: string): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: { storeId, code },
    });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  async deleteTable(tableId: string): Promise<void> {
    await this.getTableById(tableId);
    await this.tableRepository.delete(tableId);
  }

  private generateCode(length = 8): string {
    return Array.from({ length }, () =>
      randomInt(0, 36).toString(36).toUpperCase(),
    ).join('');
  }
}
