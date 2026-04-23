import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ComboService } from '../services/combo.service';
import { CurrentStore } from '@/modules/stores/common/decorators/current-store.decorator';
import { StoreContextDto } from '@/modules/stores/store/dtos/store-context.dto';
import { ComboDto, CreateComboDto } from '../dtos/combo.dto';
import { StoreManager } from '@/modules/stores/common/decorators/store-role-group.decorator';
import { ComboMapper } from '../mappers/combo.mapper';

@Controller('combos')
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post()
  @StoreManager()
  async createCombo(
    @CurrentStore() storeId: StoreContextDto,
    @Body() createComboDto: CreateComboDto,
  ) {
    return ComboMapper.toComboDto(await this.comboService.createCombo(storeId.id, createComboDto));
  }

  @Get()
  async getCombos(@CurrentStore() store: StoreContextDto) {
    return ComboMapper.toComboDtos(await this.comboService.findAll(store.id));
  }

  @Get(':id')
  async getComboById(
    @CurrentStore() store: StoreContextDto,
    @Param('id') comboId: string,
  ): Promise<ComboDto> {
    return ComboMapper.toComboDto(await this.comboService.findOne(store.id, comboId));
  }

  @Delete(':id')
  @StoreManager()
  async deleteCombo(@CurrentStore() store: StoreContextDto, @Param('id') comboId: string) {
    await this.comboService.deleteCombo(store.id, comboId);
    return { message: 'Combo deleted successfully' };
  }
}
