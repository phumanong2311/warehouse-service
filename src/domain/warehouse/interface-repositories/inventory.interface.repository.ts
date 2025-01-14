import { InventoryStatus } from '@share/types';
import { DomainInventoryEntity } from '../entities';

export interface IInventoryRepository {
  findByIdWithMapper(id: string): Promise<DomainInventoryEntity>;
  findInventoryWithQuery(
    warehouseId?: string,
    productId?: string,
    expirationDate?: Date,
    batch?: string,
    status?: InventoryStatus,
  ): Promise<DomainInventoryEntity>;
  findPaginationWithMapper(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }>;
  findAllWithMapper(): Promise<DomainInventoryEntity[]>;
  createWithMapper(
    domainEntity: DomainInventoryEntity,
  ): Promise<DomainInventoryEntity>;
  saveAndReturnDomain(
    inventory: DomainInventoryEntity,
  ): Promise<DomainInventoryEntity>;
  updateAndReturnDomain(
    id: string,
    inventory: Partial<DomainInventoryEntity>,
  ): Promise<DomainInventoryEntity>;
  deleteInventory(productId: string): Promise<void>;
}
