import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../../infra/postgresql/repositories/product.repository';
import { DomainProductEntity } from '../entities';
import { IProductRepository } from '../interface-repositories/product.interface.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}
  async getById(productId: string): Promise<DomainProductEntity> {
    try {
      return await this.productRepository.findById(productId);
    } catch (error) {
      throw new Error(error);
    }
  }
}
