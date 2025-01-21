import { DomainVariantEntity } from '@domain/product/entities';
import { InventoryRepository } from '@infra/postgresql/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryStatus } from '@share/types';
import {
  DomainInventoryEntity,
  DomainUnitEntity,
  DomainWarehouseEntity,
} from '../entities';
import { IInventoryRepository } from '../interface-repositories';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(InventoryRepository)
    private inventoryRepository: IInventoryRepository,
  ) {}
  async findInventoryWithQuery(
    warehouseId?: string,
    variantId?: string,
    unitId?: string,
    quantity?: number,
    status?: InventoryStatus,
    expirationDate?: Date,
    batch?: string,
  ): Promise<DomainInventoryEntity> {
    return await this.inventoryRepository.findInventoryWithQuery(
      warehouseId,
      variantId,
      unitId,
      quantity,
      status,
      expirationDate,
      batch,
    );
  }

  async findById(id: string): Promise<DomainInventoryEntity> {
    return await this.inventoryRepository.findById(id);
  }

  async findAll(): Promise<DomainInventoryEntity[]> {
    return await this.inventoryRepository.findAll();
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }> {
    return await this.inventoryRepository.findPagination(query);
  }

  async checkInInventory(
    warehouse: DomainWarehouseEntity,
    variant: DomainVariantEntity,
    unit: DomainUnitEntity,
    quantity: number,
    status: InventoryStatus = InventoryStatus.AVAILABLE,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity> {
    const effectiveExpirationDate =
      expirationDate ?? warehouse.getRegistrationExpirationDate();
    if (effectiveExpirationDate < new Date()) {
      throw new Error(
        'Cannot check-in inventory with expired expiration date.',
      );
    }
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }
    const existingInventory =
      await this.inventoryRepository.findInventoryWithQuery(
        warehouse.getId(),
        variant.getId(),
      );
    let inventory: DomainInventoryEntity;
    if (existingInventory) {
      existingInventory.setQuantity(existingInventory.getQuantity() + quantity);
      if (status !== existingInventory.getStatus()) {
        existingInventory.setStatus(status);
      }
      if (effectiveExpirationDate > existingInventory.getExpirationDate()) {
        existingInventory.setExpirationDate(effectiveExpirationDate);
      }
      inventory =
        await this.inventoryRepository.saveAndReturnDomain(existingInventory);
    } else {
      const domainEntity: DomainInventoryEntity = new DomainInventoryEntity({
        warehouse,
        variant,
        unit,
        quantity,
        status,
        expirationDate: effectiveExpirationDate,
      });
      inventory = await this.inventoryRepository.create(domainEntity);
    }
    return inventory;
  }

  async checkoutInventory(
    warehouse: DomainWarehouseEntity,
    variant: DomainVariantEntity,
    unit: DomainUnitEntity,
    quantity: number,
    status: InventoryStatus = InventoryStatus.AVAILABLE,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity> {
    const existingInventory =
      await this.inventoryRepository.findInventoryWithQuery(
        warehouse.getId(),
        variant.getId(),
        unit.getId(),
        quantity,
        status,
        expirationDate,
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
    variant: DomainVariantEntity,
    unit: DomainUnitEntity,
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
      variant.getId(),
      unit.getId(),
      quantity,
      status,
      expirationDate,
      batch,
    );
    if (!existingInventory) {
      throw new Error('Inventory does not exist!');
    }
    existingInventory.setQuantity(quantity);
    if (batch) existingInventory.setBatch(batch);
    if (expirationDate) existingInventory.setExpirationDate(expirationDate);
    if (status) existingInventory.setStatus(status);
    return await this.inventoryRepository.saveAndReturnDomain(
      existingInventory,
    );
  }

  async transferInventory(
    sourceWarehouse: DomainWarehouseEntity,
    targetWarehouse: DomainWarehouseEntity,
    variant: DomainVariantEntity,
    unit: DomainUnitEntity,
    status: InventoryStatus,
    quantity: number,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity[]> {
    // Chuyển inventory từ kho này sang kho khác
    const sourceInventory = await this.findInventoryWithQuery(
      sourceWarehouse.getId(),
      variant.getId(),
      unit.getId(),
      quantity,
      status,
      expirationDate,
    );

    if (sourceInventory.getQuantity() < quantity) {
      throw new Error('Insufficient quantity in source warehouse');
    }

    // Giảm số lượng trong kho nguồn
    sourceInventory.setQuantity(sourceInventory.getQuantity() - quantity);
    await this.inventoryRepository.saveAndReturnDomain(sourceInventory);

    const effectiveExpirationDate =
      expirationDate ?? targetWarehouse.getRegistrationExpirationDate();

    // Thêm số lượng vào kho đích
    const targetInventory = await this.findInventoryWithQuery(
      targetWarehouse.getId(),
      variant.getId(),
      unit.getId(),
      quantity,
      status,
      expirationDate,
    );

    if (targetInventory) {
      targetInventory.setQuantity(targetInventory.getQuantity() + quantity);
      await this.inventoryRepository.saveAndReturnDomain(targetInventory);
    } else {
      const newInventory = new DomainInventoryEntity({
        warehouse: targetWarehouse,
        variant,
        unit,
        quantity,
        status,
        expirationDate: effectiveExpirationDate,
      });
      await this.inventoryRepository.saveAndReturnDomain(newInventory);
    }

    return [sourceInventory, targetInventory];
  }
}
