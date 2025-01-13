import { DomainProductEntity } from '../entities';

export interface IProductRepository {
  findByIdWithMapper(id: string): Promise<DomainProductEntity>;
  findProductsInWarehouse(warehouseId: string): Promise<DomainProductEntity[]>;
  findPaginationWithMapper(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainProductEntity[]; total: number }>;
  findAllWithMapper(): Promise<DomainProductEntity[]>;
  saveAndReturnDomain(
    product: DomainProductEntity,
  ): Promise<DomainProductEntity>;
  updateAndReturnDomain(
    productId: string,
    product: Partial<DomainProductEntity>,
  ): Promise<DomainProductEntity>;
  deleteProduct(productId: string): Promise<void>;
}
