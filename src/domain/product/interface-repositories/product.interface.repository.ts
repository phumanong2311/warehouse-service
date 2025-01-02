import { DomainProductEntity } from '../entities';

export interface IProductRepository {
  findById(id: string): Promise<DomainProductEntity>;
  findAll(): Promise<DomainProductEntity[]>;
  findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainProductEntity[]; total: number }>;
  save(product: DomainProductEntity): Promise<DomainProductEntity>;
  update(
    productId: string,
    product: Partial<DomainProductEntity>,
  ): Promise<DomainProductEntity>;
  delete(productId: string): Promise<void>;
}
