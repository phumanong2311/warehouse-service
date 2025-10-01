import { InventoryStatus } from '@share/types';

export interface WarehouseApplication {
  checkIn(
    warehouseId: string,
    productId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
  checkOut(
    warehouseId: string,
    productId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
  adjustStock(
    warehouseId: string,
    productId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
  transfer(
    fromWarehouseId: number,
    toWarehouseId: number,
    productId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
  ): void;
}
