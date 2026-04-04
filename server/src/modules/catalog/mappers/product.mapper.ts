import { plainToInstance } from 'class-transformer';
import { ProductDto } from '../dtos/product.dto';
import { Product } from '../entities/product.entity';


export class ProductMapper {
    static toDto(product: Product): ProductDto {
        return plainToInstance(ProductDto, product, { excludeExtraneousValues: true });
    }

    static toDtos(products: Product[]): ProductDto[] {
        return products.map(product => this.toDto(product));
    }
}