export interface WarehouseApplication {
  checkInProduct(
    productId: string,
    quantity: number,
    warehouseId: string,
  ): void;
  checkOutProduct(
    productId: number,
    quantity: number,
    warehouseId: number,
  ): void;
  adjustStock(
    productId: number,
    newQuantity: number,
    warehouseId: number,
  ): void;
  transferProduct(
    productId: number,
    quantity: number,
    fromWarehouseId: number,
    toWarehouseId: number,
  ): void;
}
