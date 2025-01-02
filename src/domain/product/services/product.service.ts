import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../interface-repositories/product.interface.repository';
import { ProductRepository } from '../../../infra/postgresql/repositories/product.repository';
import { Product } from '../entities';
import { ProductMapper } from '../mapper';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}
  async findById(productId: string): Promise<Product> {
    try {
      const infraProduct = await this.productRepository.findById(productId);
      const domainProduct = ProductMapper.entityInfraToDomain(infraProduct);
      return domainProduct;
    } catch (error) {
      throw new Error(error);
    }
  }
}
