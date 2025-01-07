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
  async findById(productId: string): Promise<DomainProductEntity> {
    return await this.productRepository.findByIdWithMapper(productId);
  }
  async findAll(): Promise<DomainProductEntity[]> {
    return await this.productRepository.findAllWithMapper()
  }
}
