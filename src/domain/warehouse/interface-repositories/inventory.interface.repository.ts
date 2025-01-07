import { DomainInventoryEntity } from '../entities';

export interface IInventoryRepository {
  findByIdWithMapper(id: string): Promise<DomainInventoryEntity>;
  findByWarehouseAndProductWithMapper(warehouseId?: string,
    productId?: string
  ): Promise<DomainInventoryEntity[]>;
  findPaginationWithMapper(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }>;
  findAllWithMapper(): Promise<DomainInventoryEntity[]>;
  saveAndReturnDomain(product: DomainInventoryEntity): Promise<DomainInventoryEntity>;
  updateAndReturnDomain(
    productId: string,
    product: Partial<DomainInventoryEntity>,
  ): Promise<DomainInventoryEntity>;
  deleteProduct(productId: string): Promise<void>;
}
