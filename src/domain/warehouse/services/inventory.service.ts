import { InventoryRepository } from "@infra/postgresql/repositories";
import { Inject, Injectable } from "@nestjs/common";
import { IInventoryRepository } from "../interface-repositories";
import { DomainInventoryEntity } from "../entities";
import { WarehouseService } from "./warehouse.service";
import { ProductService } from "@domain/product/services";
import { InventoryMapper } from "../mapper";

@Injectable()
export class InventoryService {
  constructor(
    @Inject(InventoryRepository)
    private inventoryRepository: IInventoryRepository,
    private warehouseService: WarehouseService,
    private productService: ProductService,
  ) { }
  async findInventoryWithQuery(warehouseId?: string, productId?: string, expirationDate?: Date, batch?: string): Promise<DomainInventoryEntity> {
    return await this.inventoryRepository.findInventoryWithQuery(warehouseId, productId, expirationDate, batch);
  }

  async findById(id): Promise<DomainInventoryEntity> {
    return await this.inventoryRepository.findByIdWithMapper(id)
  }

  async getTotalQuantity(warehouseId?: string, productId?: string, expirationDate?: Date, batch?: string): Promise<number> {
    return (await this.findInventoryWithQuery(warehouseId, productId, expirationDate, batch)).getQuantity();
  };

  async findAll(): Promise<DomainInventoryEntity[]> {
    return await this.inventoryRepository.findAllWithMapper();
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainInventoryEntity[]; total: number; }> {
    return await this.inventoryRepository.findPaginationWithMapper(query);
  }

  async adjustQuantity(
    warehouseId: string,
    productId: string,
    quantity: number,
    batch?: string,
    expirationDate?: Date
  ): Promise<DomainInventoryEntity> {
    const warehouse = await this.warehouseService.findById(warehouseId);
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (quantity < 0) {
      throw new Error('Quantity must be non-negative');
    }
    const isExit = await this.findInventoryWithQuery(warehouseId, productId, expirationDate, batch);
    if (isExit) {
      throw new Error('Inventory is exit!!')
    }
    const inventory: DomainInventoryEntity = new DomainInventoryEntity({
      warehouse,
      product,
      quantity,
      batch,
      expirationDate
    });

    const data = await this.inventoryRepository.saveAndReturnDomain(inventory)

    return data;
  }

  async transferQuantityProduct(
    productId: string,
    fromWarehouseId: string,
    toWarehouseId: string
  ): Promise<void> {
    const fromInventory = await this.findInventoryWithQuery(fromWarehouseId, productId);
    if (!fromInventory) {
      throw new Error('No inventory found in the source warehouse');
    }

    const toInventory = await this.findInventoryWithQuery(toWarehouseId, productId);
    if (!toInventory) {
      await this.adjustQuantity(toWarehouseId, productId, fromInventory.getQuantity());
    } else {
      toInventory.setQuantity(toInventory.getQuantity() + fromInventory.getQuantity());
      await this.inventoryRepository.updateAndReturnDomain(toInventory.getId(), toInventory);
    }

    // Xóa Inventory tại Warehouse nguồn
    await this.inventoryRepository.deleteInventory(fromInventory.getId());
  }
}
