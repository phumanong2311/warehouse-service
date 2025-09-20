import { InventoryStatus } from '@share/types';
import { DomainInventoryEntity, DomainWarehouseEntity } from '../entities';
import { IInventoryRepository } from '../interface-repositories';
import { UnitService } from './unit.service';
import { WarehouseService } from './warehouse.service';

export class InventoryService {
  constructor(
    private inventoryRepository: IInventoryRepository,
    private warehouseService: WarehouseService,
    private unitService: UnitService,
  ) {}
  async findInventoryWithQuery(
    warehouseId?: string,
    variantId?: string,
    unitId?: string,
    quantity?: number,
    status?: InventoryStatus,
    expirationDate?: Date,
    batch?: string,
  ): Promise<{ data: DomainInventoryEntity[]; total: number }> {
    const query = {
      warehouseId,
      variantId,
      unitId,
      quantity,
      status,
      expirationDate,
      batch,
    };
    return await this.inventoryRepository.findWithPagination(query);
  }

  async findById(id: string): Promise<DomainInventoryEntity> {
    return await this.inventoryRepository.findByIdInventory(id);
  }

  async findAll(): Promise<DomainInventoryEntity[]> {
    return await this.inventoryRepository.findAllInventories();
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }> {
    return await this.inventoryRepository.findWithPagination(query);
  }

  generateBatchId(warehouseId: string, variantId: string): string {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0'); // 001 to 999
    return `BATCH-${timestamp}-${warehouseId}-${variantId}-${randomSuffix}`;
  }

  async checkInInventory(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus = InventoryStatus.AVAILABLE,
    expirationDate?: Date,
    batch?: string,
  ): Promise<DomainInventoryEntity> {
    const warehouse =
      await this.warehouseService.findByIdWarehouse(warehouseId);
    // Calculate the effective expiration date
    const effectiveExpirationDate =
      expirationDate ?? warehouse.getRegistrationExpirationDate();
    // Validate expiration date
    if (effectiveExpirationDate < new Date()) {
      throw new Error(
        'Cannot check-in inventory with expired expiration date.',
      );
    }
    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }
    // Check for existing inventory
    const existingInventory =
      await this.inventoryRepository.findByWarehouseAndVariant(
        warehouseId,
        variantId,
        unitId,
        status,
        expirationDate,
      );
    let inventory: DomainInventoryEntity;
    if (existingInventory) {
      // Update existing inventory
      existingInventory.setQuantity(existingInventory.getQuantity() + quantity);
      if (status !== existingInventory.getStatus()) {
        throw new Error(
          'Status mismatch! The inventory status does not match the requested status.',
        );
      }
      if (effectiveExpirationDate > existingInventory.getExpirationDate()) {
        existingInventory.setExpirationDate(effectiveExpirationDate);
      }
      if (existingInventory.getUnit() !== unitId) {
        throw new Error(
          'Unit mismatch! The inventory unit does not match the requested unit.',
        );
      }
      if (existingInventory.getBatch() !== batch) {
        throw new Error(
          'Batch mismatch! The inventory batch does not match the requested batch.',
        );
      }
      inventory =
        await this.inventoryRepository.saveAndReturnDomain(existingInventory);
    } else {
      // Create new inventory
      const batchId =
        batch || this.generateBatchId(warehouse.getId(), variantId);
      const domainEntity: DomainInventoryEntity = new DomainInventoryEntity({
        warehouseId,
        variantId,
        unitId,
        quantity,
        status,
        expirationDate: effectiveExpirationDate,
        batch: batchId,
      });
      inventory = await this.inventoryRepository.createInventory(domainEntity);
    }
    return inventory;
  }

  async checkOutInventory(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus = InventoryStatus.AVAILABLE,
  ): Promise<DomainInventoryEntity> {
    // Step 1: Find the existing inventory for the given warehouse and variant
    const existingInventory =
      await this.inventoryRepository.findByWarehouseAndVariant(
        warehouseId,
        variantId,
        unitId,
        status,
      );

    // Step 2: Check if the inventory exists
    if (!existingInventory) {
      throw new Error('Inventory does not exist!');
    }

    // Step 3: Check if the unit matches the existing inventory's unit
    if (existingInventory.getUnit() !== unitId) {
      throw new Error(
        'Unit mismatch! The inventory unit does not match the requested unit.',
      );
    }

    if (existingInventory.getStatus() !== status) {
      throw new Error(
        'Unit mismatch! The inventory status does not match the requested status.',
      );
    }

    // Step 4: Check if the requested quantity is available
    if (quantity > existingInventory.getQuantity()) {
      throw new Error('Insufficient quantity!');
    }

    // Step 5: Deduct the quantity from the existing inventory
    existingInventory.setQuantity(existingInventory.getQuantity() - quantity);

    // Step 6: Save the updated inventory and return it
    return await this.inventoryRepository.saveAndReturnDomain(
      existingInventory,
    );
  }

  async adjustQuantity(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    batch?: string,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity> {
    if (quantity < 0) {
      throw new Error('Quantity must be non-negative');
    }
    const existingInventory =
      await this.inventoryRepository.findByWarehouseAndVariant(
        warehouseId,
        variantId,
        unitId,
        status,
        expirationDate,
      );
    if (!existingInventory) {
      throw new Error('Inventory does not exist!');
    }
    existingInventory.setQuantity(quantity);
    if (batch) existingInventory.setBatch(batch);
    if (expirationDate) existingInventory.setExpirationDate(expirationDate);
    if (status) existingInventory.setStatus(status);
    if (unitId && existingInventory.getUnit() !== unitId) {
      existingInventory.setUnit(unitId);
    }
    return await this.inventoryRepository.saveAndReturnDomain(
      existingInventory,
    );
  }

  async transferInventory(
    sourceWarehouseId: string,
    targetWarehouseId: string,
    variantId: string,
    unitId: string,
    status: InventoryStatus,
    quantity: number,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity[]> {
    // Chuyển inventory từ kho này sang kho khác
    const sourceInventory =
      await this.inventoryRepository.findByWarehouseAndVariant(
        sourceWarehouseId,
        variantId,
        variantId,
        status,
        expirationDate,
      );

    const targetWarehouse: DomainWarehouseEntity =
      await this.warehouseService.findByIdWarehouse(targetWarehouseId);

    if (sourceInventory.getQuantity() < quantity) {
      throw new Error('Insufficient quantity in source warehouse');
    }

    // Giảm số lượng trong kho nguồn
    sourceInventory.setQuantity(sourceInventory.getQuantity() - quantity);
    await this.inventoryRepository.saveAndReturnDomain(sourceInventory);

    const effectiveExpirationDate =
      expirationDate ?? targetWarehouse.getRegistrationExpirationDate();

    // Thêm số lượng vào kho đích
    const targetInventory =
      await this.inventoryRepository.findByWarehouseAndVariant(
        targetWarehouseId,
        variantId,
        unitId,
        status,
        expirationDate,
      );

    if (targetInventory) {
      targetInventory.setQuantity(targetInventory.getQuantity() + quantity);
      await this.inventoryRepository.saveAndReturnDomain(targetInventory);
    } else {
      const newInventory = new DomainInventoryEntity({
        warehouseId: targetWarehouseId,
        variantId,
        unitId,
        quantity,
        status,
        expirationDate: effectiveExpirationDate,
      });
      await this.inventoryRepository.saveAndReturnDomain(newInventory);
    }
    return [sourceInventory, targetInventory];
  }
}
