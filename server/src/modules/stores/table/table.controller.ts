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
import { StoreManager, StoreStaff } from '../common/decorators/store-role-group.decorator';
import { TableStatus } from '../common/constants/table.constant';
import { mapToTableGroupByZones } from './table.mapper';

@Controller('tables')
@UseGuards(JwtGuard, StoreRoleGuard)
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @StoreManager()
  async createTable(
    @CurrentStore('id') storeId: string,
    @Body() dto: CreateTableDto,
  ): Promise<Table> {
    return this.tableService.createTable(storeId, dto);
  }

  @Get()
  @StoreStaff()
  async getTablesGroupByZone(@CurrentStore('id') storeId: string) {
    return this.tableService.getTablesInStore(storeId);
  }

  @Get('grouped')
  @StoreStaff()
  async getListTables(
    @CurrentStore('id') storeId: string,
    @Query('zoneId') zoneId?: string,
  ): Promise<TableGroupByZoneDto[]> {
    const tables = zoneId
      ? this.tableService.getTablesInZone(storeId, zoneId)
      : this.tableService.getTablesInStore(storeId);

    return mapToTableGroupByZones(await tables);
  }

  @Get(':id')
  async getTableById(@CurrentStore('id') storeId: string, @Param('id') id: string): Promise<Table> {
    return this.tableService.getTableById(storeId, id);
  }

  @Patch(':id')
  @StoreManager()
  async updateTable(
    @CurrentStore('id') storeId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTableDto,
  ): Promise<Table> {
    return this.tableService.updateTable(storeId, id, dto);
  }

  @Delete(':id')
  @StoreManager()
  async deleteTable(@CurrentStore('id') storeId: string, @Param('id') id: string): Promise<void> {
    return this.tableService.deleteTable(storeId, id);
  }

  @Patch(':id/status')
  async changeTableStatus(
    @CurrentStore('id') storeId: string,
    @Param('id') id: string,
    @Query('status') status: TableStatus,
  ): Promise<Table> {
    return this.tableService.changeTableStatus(storeId, id, status);
  }

  @Put('reorder')
  @StoreManager()
  async reorderTables(
    @CurrentStore('id') storeId: string,
    @Body() dto: { zoneId: string; orderedIds: string[] },
  ): Promise<Table[]> {
    const { zoneId, orderedIds } = dto;
    return this.tableService.reorderTables(storeId, zoneId, orderedIds);
  }
}
