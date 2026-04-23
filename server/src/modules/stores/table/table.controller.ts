import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto, TableGroupByZoneDto, UpdateTableDto } from './dtos/table.dto';
import { Table } from './table.entity';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '../common/guards/store-role.guard';
import { CurrentStore } from '../common/decorators/current-store.decorator';
import { StoreContextDto } from '../store/dtos/store-context.dto';
import { StoreManager } from '../common/decorators/store-role-group.decorator';
import { TableStatus } from '../common/constants/table.constant';
import { mapToTableGroupByZones } from './table.mapper';

@Controller('tables')
@UseGuards(JwtGuard, StoreRoleGuard)
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @StoreManager()
  async createTable(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateTableDto,
  ): Promise<Table> {
    return this.tableService.createTable(store.id, dto);
  }

  @Get()
  async getListTables(
    @CurrentStore() store: StoreContextDto,
    @Query('zoneId') zoneId?: string,
  ): Promise<TableGroupByZoneDto[]> {
    const tables = zoneId
      ? this.tableService.getTablesInZone(store.id, zoneId)
      : this.tableService.getTablesInStore(store.id);
    return mapToTableGroupByZones(await tables);
  }

  @Get('grouped')
  async getTablesGroupByZone(@CurrentStore() store: StoreContextDto) {
    return this.tableService.getTablesInStore(store.id);
  }

  @Get(':id')
  async getTableById(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<Table> {
    return this.tableService.getTableById(store.id, id);
  }

  @Patch(':id')
  @StoreManager()
  async updateTable(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
    @Body() dto: UpdateTableDto,
  ): Promise<Table> {
    return this.tableService.updateTable(store.id, id, dto);
  }

  @Delete(':id')
  @StoreManager()
  async deleteTable(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.tableService.deleteTable(store.id, id);
  }

  @Patch(':id/status')
  async changeTableStatus(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
    @Query('status') status: TableStatus,
  ): Promise<Table> {
    return this.tableService.changeTableStatus(store.id, id, status);
  }

  @Put('reorder')
  @StoreManager()
  async reorderTables(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: { zoneId: string; orderedIds: string[] },
  ): Promise<Table[]> {
    const { zoneId, orderedIds } = dto;
    return this.tableService.reorderTables(store.id, zoneId, orderedIds);
  }
}
