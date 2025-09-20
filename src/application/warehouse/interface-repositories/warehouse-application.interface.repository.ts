import { InventoryStatus } from '@share/types';

export interface WarehouseApplication {
  checkIn(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
  checkOut(
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
  transfer(
    fromWarehouseId: number,
    toWarehouseId: number,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
}
