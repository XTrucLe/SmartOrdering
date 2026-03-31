import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Param,
} from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
  IngredientResponseDto,
} from '../dtos/ingredient.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { StoreRoleGuard } from '../../stores/guards/store-role.guard';
import { CurrentStore } from '../../stores/decorators/current-store.decorator';
import { StoreInfo } from '@/modules/stores/dtos/stores/store-info.dto';
import {
  mapToIngredientResponseDto,
  mapToIngredientResponseDtos,
} from '../mappers/ingredient.mapper';
import { StoreManager } from '@/modules/stores/decorators/store-role-group.decorator';

@Controller('ingredients')
@UseGuards(JwtGuard, StoreRoleGuard)
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @StoreManager()
  async createIngredient(
    @CurrentStore() store: StoreInfo,
    @Body() dto: CreateIngredientDto,
  ): Promise<IngredientResponseDto> {
    const ingredient = await this.ingredientService.create(store.id, dto);
    return mapToIngredientResponseDto(ingredient);
  }

  @Get()
  @StoreManager()
  async getIngredients(
    @CurrentStore() store: StoreInfo,
  ): Promise<IngredientResponseDto[]> {
    const ingredients = await this.ingredientService.findAll(store.id);
    return mapToIngredientResponseDtos(ingredients);
  }

  @Get(':id')
  async getIngredientById(
    @CurrentStore() store: StoreInfo,
    @Param('id') id: string,
  ): Promise<IngredientResponseDto> {
    const ingredient = await this.ingredientService.getIngredientById(
      store.id,
      id,
    );
    return mapToIngredientResponseDto(ingredient);
  }

  @Put(':id')
  @StoreManager()
  async updateIngredient(
    @CurrentStore() store: StoreInfo,
    @Param('id') id: string,
    @Body() dto: UpdateIngredientDto,
  ): Promise<IngredientResponseDto> {
    const ingredient = await this.ingredientService.update(store.id, id, dto);
    return mapToIngredientResponseDto(ingredient);
  }

  @Delete(':id')
  @StoreManager()
  async deleteIngredient(
    @CurrentStore() store: StoreInfo,
    @Param('id') id: string,
  ) {
    return this.ingredientService.remove(store.id, id);
  }
}
