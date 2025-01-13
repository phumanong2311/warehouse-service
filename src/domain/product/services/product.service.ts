import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../../infra/postgresql/repositories/product.repository';
import { DomainProductEntity } from '../entities';
import { IProductRepository } from '../interface-repositories/product.interface.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: IProductRepository,
  ) { }
  async findById(productId: string): Promise<DomainProductEntity> {
    return await this.productRepository.findByIdWithMapper(productId);
  }
  async findAll(): Promise<DomainProductEntity[]> {
    return await this.productRepository.findAllWithMapper();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainProductEntity[]; total: number }> {
    return this.productRepository.findPaginationWithMapper(query);
  }
  async create(product: DomainProductEntity) {
    return this.productRepository.saveAndReturnDomain(product);
  }
  async update(
    id: string,
    product: Partial<DomainProductEntity>,
  ): Promise<DomainProductEntity> {
    const isExit = await this.productRepository.findByIdWithMapper(id);
    if (!isExit) {
      throw new Error(`Product with id ${id} not found`);
    }
    const warehouse = product.getWarehouse();
    const rack = product.getRack();
    if (warehouse || rack) {
      throw new Error(`Can't update this attribute`);
    }
    return this.productRepository.updateAndReturnDomain(id, product);
  }
  async delete(id: string): Promise<void> {
    return this.productRepository.deleteProduct(id);
  }
}
