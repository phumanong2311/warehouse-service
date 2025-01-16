import { InventoryStatus } from '@share/types';

export interface WarehouseApplication {
  checkInProduct(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
  checkOutProduct(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
  adjustStock(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
  transferProduct(
    fromWarehouseId: number,
    toWarehouseId: number,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
}
