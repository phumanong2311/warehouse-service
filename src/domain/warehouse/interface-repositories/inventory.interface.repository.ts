import { InventoryStatus } from '@share/types';
import { DomainInventoryEntity } from '../entities';

export interface IInventoryRepository {
  findByIdInventory(id: string): Promise<DomainInventoryEntity>;
  findWithPagination(query: {
    warehouseId?: string;
    variantId?: string;
    unitId?: string;
    quantity?: number;
    status?: InventoryStatus;
    expirationDate?: Date;
    batch?: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }>;
  findAllInventories(): Promise<DomainInventoryEntity[]>;
  createInventory(
    domainEntity: DomainInventoryEntity,
  ): Promise<DomainInventoryEntity>;
  saveAndReturnDomain(
    inventory: DomainInventoryEntity,
  ): Promise<DomainInventoryEntity>;
  updateAndReturnDomain(
    id: string,
    inventory: Partial<DomainInventoryEntity>,
  ): Promise<DomainInventoryEntity>;
  deleteInventory(id: string): Promise<void>;
}
