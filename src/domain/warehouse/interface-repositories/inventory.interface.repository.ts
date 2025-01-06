import { DomainInventoryEntity } from '../entities';

export interface IInventoryRepository {
  getTotalQuantity(productId: string): Promise<number>;
  getQuantityByWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<number>;
  getInventoryWithMapper(warehouseId: string, productId: string): Promise<DomainInventoryEntity>;
  addQuantity(inventoryId: string): Promise<DomainInventoryEntity>;
  minusQuantity(inventoryId: string): Promise<DomainInventoryEntity>;
}
