import { DomainProductEntity } from '../entities';

export interface IProductRepository {
  findByProductId(id: string): Promise<DomainProductEntity>;
  findProductsInWarehouse(warehouseId: string): Promise<DomainProductEntity[]>;
  findProductsInCategory(categoryId: string): Promise<DomainProductEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainProductEntity[]; total: number }>;
  findAllProducts(): Promise<DomainProductEntity[]>;
  saveAndReturnDomain(
    product: DomainProductEntity,
  ): Promise<DomainProductEntity>;
  updateAndReturnDomain(
    productId: string,
    product: Partial<DomainProductEntity>,
  ): Promise<DomainProductEntity>;
  deleteProduct(id: string): Promise<void>;
}
