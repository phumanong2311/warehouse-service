import { InventoryStatus } from '@share/types';
import {
  DomainInventoryEntity,
  DomainUnitEntity,
  DomainWarehouseEntity,
} from '../entities';

export interface IInventoryRepository {
  findByIdInventory(id: string): Promise<DomainInventoryEntity>;
  findByWarehouseAndVariant(
    warehouseId: string,
    productId: string,
    unitId: string,
    status: string,
    expirationDate?: Date,
  ): DomainInventoryEntity;
  findWithPagination(query: {
    warehouseId?: string;
    productId?: string;
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
  checkInInventory(
    warehouse: DomainWarehouseEntity,
    productId: string,
    unit: DomainUnitEntity,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
    batch?: string,
  ): Promise<DomainInventoryEntity>;
  checkOutInventory(
    warehouse: DomainWarehouseEntity,
    productId: string,
    unit: DomainUnitEntity,
    quantity: number,
    status: InventoryStatus,
  ): Promise<DomainInventoryEntity>;
  adjustQuantity(
    warehouse: DomainWarehouseEntity,
    productId: string,
    unit: DomainUnitEntity,
    quantity: number,
    status: InventoryStatus,
    batch?: string,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity>;
  transferInventory(
    sourceWarehouse: DomainWarehouseEntity,
    targetWarehouse: DomainWarehouseEntity,
    productId: string,
    unit: DomainUnitEntity,
    status: InventoryStatus,
    quantity: number,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity[]>;
}
