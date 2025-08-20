import { DomainProductEntity } from '../../../domain/product/entities';
import { IProductRepository } from '../../../domain/product/interface-repositories/product.interface.repository';

export interface FindProductUseCase {
  findById(productId: string): Promise<DomainProductEntity>;
  findAll(): Promise<DomainProductEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainProductEntity[]; total: number }>;
}

export class FindProductUseCaseImpl implements FindProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async findById(productId: string): Promise<DomainProductEntity> {
    return await this.productRepository.findByProductId(productId);
  }

  async findAll(): Promise<DomainProductEntity[]> {
    return await this.productRepository.findAllProducts();
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainProductEntity[]; total: number }> {
    return this.productRepository.findWithPagination(query);
  }
}
