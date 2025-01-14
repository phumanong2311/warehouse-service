import { DomainProductEntity } from '@domain/product/entities';
import { InventoryRepository } from '@infra/postgresql/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryStatus } from '@share/types';
import { DomainInventoryEntity, DomainWarehouseEntity } from '../entities';
import { IInventoryRepository } from '../interface-repositories';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(InventoryRepository)
    private inventoryRepository: IInventoryRepository,
  ) {}
  async findInventoryWithQuery(
    warehouseId?: string,
    productId?: string,
    expirationDate?: Date,
    batch?: string,
    status?: InventoryStatus,
  ): Promise<DomainInventoryEntity> {
    return await this.inventoryRepository.findInventoryWithQuery(
      warehouseId,
      productId,
      expirationDate,
      batch,
      status,
    );
  }

  async findById(id: string): Promise<DomainInventoryEntity> {
    return await this.inventoryRepository.findByIdWithMapper(id);
  }

  async getTotalQuantity(
    warehouseId?: string,
    productId?: string,
    expirationDate?: Date,
    batch?: string,
  ): Promise<number> {
    return (
      await this.findInventoryWithQuery(
        warehouseId,
        productId,
        expirationDate,
        batch,
      )
    ).getQuantity();
  }

  async findAll(): Promise<DomainInventoryEntity[]> {
    return await this.inventoryRepository.findAllWithMapper();
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }> {
    return await this.inventoryRepository.findPaginationWithMapper(query);
  }

  async checkInInventory(
    warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
    status: InventoryStatus = InventoryStatus.AVAILABLE,
  ): Promise<DomainInventoryEntity> {
    const existingInventory =
      await this.inventoryRepository.findInventoryWithQuery(
        warehouse.getId(),
        product.getId(),
      );
    const domainEntity: DomainInventoryEntity = new DomainInventoryEntity({
      warehouse,
      product,
      quantity,
      status,
    });
    let inventory: DomainInventoryEntity;
    return (inventory = existingInventory
      ? await this.inventoryRepository.saveAndReturnDomain(domainEntity)
      : await this.inventoryRepository.createWithMapper(domainEntity));
  }

  async checkoutInventory(
    warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
  ): Promise<DomainInventoryEntity> {
    const existingInventory =
      await this.inventoryRepository.findInventoryWithQuery(
        warehouse.getId(),
        product.getId(),
      );

    if (!existingInventory) {
      throw new Error('Inventory does not exist!');
    }

    if (quantity > existingInventory.getQuantity()) {
      throw new Error('Insufficient quantity!');
    }
    existingInventory.setQuantity(existingInventory.getQuantity() - quantity);

    return await this.inventoryRepository.saveAndReturnDomain(
      existingInventory,
    );
  }

  async adjustQuantity(
    warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
    status: InventoryStatus,
    batch?: string,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity> {
    if (quantity < 0) {
      throw new Error('Quantity must be non-negative');
    }
    const existingInventory = await this.findInventoryWithQuery(
      warehouse.getId(),
      product.getId(),
      expirationDate,
      batch,
      status,
    );

    if (existingInventory) {
      existingInventory.setQuantity(quantity);
      if (batch) existingInventory.setBatch(batch);
      if (expirationDate) existingInventory.setExpirationDate(expirationDate);
      if (status) existingInventory.setStatus(status);
      return await this.inventoryRepository.saveAndReturnDomain(
        existingInventory,
      );
    }

    const newInventory = new DomainInventoryEntity({
      warehouse,
      product,
      quantity,
      batch,
      expirationDate,
    });

    return await this.inventoryRepository.saveAndReturnDomain(newInventory);
  }

  async transferInventory(
    sourceWarehouse: DomainWarehouseEntity,
    targetWarehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
  ): Promise<DomainInventoryEntity[]> {
    // Chuyển inventory từ kho này sang kho khác
    const sourceInventory = await this.findInventoryWithQuery(
      sourceWarehouse.getId(),
      product.getId(),
    );

    if (sourceInventory.getQuantity() < quantity) {
      throw new Error('Insufficient quantity in source warehouse');
    }

    // Giảm số lượng trong kho nguồn
    sourceInventory.setQuantity(sourceInventory.getQuantity() - quantity);
    await this.inventoryRepository.saveAndReturnDomain(sourceInventory);

    // Thêm số lượng vào kho đích
    const targetInventory = await this.findInventoryWithQuery(
      targetWarehouse.getId(),
      product.getId(),
    );

    if (targetInventory) {
      targetInventory.setQuantity(targetInventory.getQuantity() + quantity);
      await this.inventoryRepository.saveAndReturnDomain(targetInventory);
    } else {
      const newInventory = new DomainInventoryEntity({
        warehouse: targetWarehouse,
        product,
        quantity,
      });
      await this.inventoryRepository.saveAndReturnDomain(newInventory);
    }

    return [sourceInventory, targetInventory];
  }
}
