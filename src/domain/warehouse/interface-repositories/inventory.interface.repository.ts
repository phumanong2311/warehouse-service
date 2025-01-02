import { DomainInventoryEntity } from '../entities';

export interface IInventoryRepository {
  getTotalQuantity(productId: string): Promise<number>;
  getQuantityByWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<number>;
  addQuantity(inventoryId: string): Promise<DomainInventoryEntity>;
  minusQuantity(inventoryId: string): Promise<DomainInventoryEntity>;
}
