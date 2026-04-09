import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { CategoryService } from './category.service';
import { handleError } from '@/common/utils/handle-error';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(storeId: string, dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryService.getCategoryWithProducts(storeId, dto.categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${dto.categoryId} not found.`);
    }

    const newProduct = this.productRepository.create({
      ...dto,
      categoryId: dto.categoryId,
      category: { id: dto.categoryId },
      displayOrder: (category.products?.length || 0) + 1,
    });
    try {
      return this.productRepository.save(newProduct);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  async findProduct(storeId: string, productId: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id: productId, category: { store: { id: storeId } } },
      relations: ['category'],
    });
  }

  async findAllByStore(storeId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { category: { store: { id: storeId } } },
      order: { displayOrder: 'ASC' },
    });
  }

  async getProductById(storeId: string, id: string): Promise<Product> {
    const product = await this.findProduct(storeId, id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    return product;
  }

  async getProductsByCategory(storeId: string, categoryId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { category: { id: categoryId, store: { id: storeId } } },
      order: { displayOrder: 'ASC' },
    });
  }

  async update(storeId: string, productId: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findProduct(storeId, productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async delete(storeId: string, productId: string): Promise<void> {
    const product = await this.getProductById(storeId, productId);

    await this.productRepository.remove(product);
  }

  async reorder(storeId: string, categoryId: string, orderedIds: string[]): Promise<void> {
    const products = await this.getProductsByCategory(storeId, categoryId);
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (let i = 0; i < orderedIds.length; i++) {
      const product = productMap.get(orderedIds[i]);
      if (product) {
        product.displayOrder = i + 1;
        await this.productRepository.save(product);
      }
    }
  }

  async activeProduct(storeId: string, productId: string): Promise<Product> {
    return this.toggleActive(storeId, productId, 'active');
  }

  async inactiveProduct(storeId: string, productId: string): Promise<Product> {
    return this.toggleActive(storeId, productId, 'inactive');
  }

  private async toggleActive(storeId: string, productId: string, action: string): Promise<Product> {
    const product = await this.getProductById(storeId, productId);
    if (action === 'active' && product.isActive) {
      throw new ConflictException(`Product with ID ${productId} is already active.`);
    }

    if (action === 'inactive' && !product.isActive) {
      throw new ConflictException(`Product with ID ${productId} is already inactive.`);
    }

    product.isActive = !product.isActive;
    return this.productRepository.save(product);
  }
}
