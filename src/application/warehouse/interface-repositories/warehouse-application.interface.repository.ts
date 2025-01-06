export interface WarehouseApplication {
  checkInProduct(
    warehouseId: string,
    productId: string,
    quantity: number,
  ): void;
  checkOutProduct(
    warehouseId: string,
    productId: string,
    quantity: number,
  ): void;
  adjustStock(
    warehouseId: number,
    productId: number,
    newQuantity: number,
  ): void;
  transferProduct(
    fromWarehouseId: number,
    toWarehouseId: number,
    productId: number,
    quantity: number,
  ): void;
}
