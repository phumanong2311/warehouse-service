import { Injectable } from '@nestjs/common';
import { DomainProductEntity } from '../entities';
import { ProductNotFoundException, ProductCannotBeUpdatedException } from '../exceptions';

/**
 * @deprecated Use ProductApplicationService instead
 * This service is kept for backward compatibility but should be replaced
 * with the new application service layer
 */
@Injectable()
export class ProductService {
  constructor() {
    console.warn('ProductService is deprecated. Use ProductApplicationService instead.');
  }

  async findById(productId: string): Promise<DomainProductEntity> {
    throw new Error('Method deprecated. Use ProductApplicationService.getProductById instead.');
  }

  async findAll(): Promise<DomainProductEntity[]> {
    throw new Error('Method deprecated. Use ProductApplicationService.getProducts instead.');
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainProductEntity[]; total: number }> {
    throw new Error('Method deprecated. Use ProductApplicationService.getProducts instead.');
  }

  async create(product: DomainProductEntity): Promise<DomainProductEntity> {
    throw new Error('Method deprecated. Use ProductApplicationService.createProduct instead.');
  }

  async update(
    id: string,
    product: Partial<DomainProductEntity>,
  ): Promise<DomainProductEntity> {
    throw new Error('Method deprecated. Use ProductApplicationService.updateProduct instead.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method deprecated. Use ProductApplicationService.deleteProduct instead.');
  }
}
