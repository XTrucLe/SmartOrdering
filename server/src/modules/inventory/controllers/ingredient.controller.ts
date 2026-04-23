import { Body, Controller, Post, Get, Put, Delete, UseGuards, Param } from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
  IngredientResponseDto,
} from '../dtos/ingredient.dto';
import { JwtGuard } from '../../identity/guards/jwt.guard';
import { StoreRoleGuard } from '../../stores/common/guards/store-role.guard';
import { CurrentStore } from '../../stores/common/decorators/current-store.decorator';
import { StoreContextDto } from '@/modules/stores/store/dtos/store-context.dto';
import { IngredientMapper } from '../mappers/ingredient.mapper';
import { StoreManager } from '@/modules/stores/common/decorators/store-role-group.decorator';

@Controller('ingredients')
@UseGuards(JwtGuard, StoreRoleGuard)
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @StoreManager()
  async createIngredient(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateIngredientDto,
  ): Promise<IngredientResponseDto> {
    const ingredient = await this.ingredientService.create(store.id, dto);
    return IngredientMapper.toDto(ingredient);
  }

  @Get()
  @StoreManager()
  async getIngredients(@CurrentStore() store: StoreContextDto): Promise<IngredientResponseDto[]> {
    const ingredients = await this.ingredientService.findAll(store.id);
    return IngredientMapper.toList(ingredients);
  }

  @Get(':id')
  async getIngredientById(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<IngredientResponseDto> {
    const ingredient = await this.ingredientService.getIngredientById(store.id, id);
    return IngredientMapper.toDto(ingredient);
  }

  @Get('code/:code')
  async getIngredientByCode(
    @CurrentStore() store: StoreContextDto,
    @Param('code') code: string,
  ): Promise<IngredientResponseDto> {
    const ingredient = await this.ingredientService.getIngredientByCode(store.id, code);
    return IngredientMapper.toDto(ingredient);
  }

  @Put(':id')
  @StoreManager()
  async updateIngredient(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
    @Body() dto: UpdateIngredientDto,
  ): Promise<IngredientResponseDto> {
    const ingredient = await this.ingredientService.update(store.id, id, dto);
    return IngredientMapper.toDto(ingredient);
  }

  @Delete(':id')
  @StoreManager()
  async deleteIngredient(@CurrentStore() store: StoreContextDto, @Param('id') id: string) {
    return this.ingredientService.remove(store.id, id);
  }
}
