import { InventoryRepository } from "@infra/postgresql/repositories";
import { Inject, Injectable } from "@nestjs/common";
import { IInventoryRepository } from "../interface-repositories";

@Injectable()
export class InventoryService {
  constructor(
    @Inject(InventoryRepository)
    private inventoryRepository: IInventoryRepository
  ) { }
  async getInventory(warehouseId: string, productId: string) {
    return await this.inventoryRepository.getInventoryWithMapper(warehouseId, productId);
  }
  getTotalQuantity(productId: string): Promise<number>;
  getQuantityByWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<number>;
  getInventoryWithMapper(warehouseId: string, productId: string): Promise<DomainInventoryEntity>;
  addQuantity(inventoryId: string): Promise<DomainInventoryEntity>;
  minusQuantity(inventoryId: string): Promise<DomainInventoryEntity>;
}
