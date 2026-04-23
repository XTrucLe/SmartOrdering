import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreRoleGuard } from '@/modules/stores/common/guards/store-role.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { StoreManager } from '@/modules/stores/common/decorators/store-role-group.decorator';
import { CreateProductDto, ProductDto, UpdateProductDto } from '../dtos/product.dto';
import { CurrentStore } from '@/modules/stores/common/decorators/current-store.decorator';
import { StoreContextDto } from '@/modules/stores/store/dtos/store-context.dto';
import { ProductMapper } from '../mappers/product.mapper';

@Controller('products')
@UseGuards(JwtGuard, StoreRoleGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @StoreManager()
  async createProduct(
    @CurrentStore() store: StoreContextDto,
    @Body() dto: CreateProductDto,
  ): Promise<ProductDto> {
    const newProduct = await this.productService.create(store.id, dto);
    return ProductMapper.toDto(newProduct);
  }

  @Get()
  async getProducts(@CurrentStore() store: StoreContextDto): Promise<ProductDto[]> {
    const products = await this.productService.findAllByStore(store.id);
    return ProductMapper.toDtos(products);
  }

  @Get(':id')
  async getProductById(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<ProductDto> {
    const product = await this.productService.getProductById(store.id, id);
    return ProductMapper.toDto(product);
  }
  @Put(':id')
  async updateProduct(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productService.update(store.id, id, dto);
    return ProductMapper.toDto(product);
  }

  @Delete(':id')
  async deleteProduct(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<void> {
    await this.productService.delete(store.id, id);
  }

  @Patch(':id/disable')
  async disableProduct(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<ProductDto> {
    const product = await this.productService.inactiveProduct(store.id, id);
    return ProductMapper.toDto(product);
  }

  @Patch(':id/enable')
  async enableProduct(
    @CurrentStore() store: StoreContextDto,
    @Param('id') id: string,
  ): Promise<ProductDto> {
    const product = await this.productService.activeProduct(store.id, id);
    return ProductMapper.toDto(product);
  }
}
