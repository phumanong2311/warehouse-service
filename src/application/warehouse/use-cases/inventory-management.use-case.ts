import { DomainInventoryEntity, DomainUnitEntity, DomainWarehouseEntity } from '../../../domain/warehouse/entities';
import { IInventoryRepository } from '../../../domain/warehouse/interface-repositories/inventory.interface.repository';
import { IWarehouseRepository } from '../../../domain/warehouse/interface-repositories/warehouse.interface.repository';
import { InventoryStatus } from '@share/types';

export interface InventoryManagementUseCase {
  findById(id: string): Promise<DomainInventoryEntity>;
  findByWarehouse(warehouseId: string): Promise<DomainInventoryEntity[]>;
  findByVariant(variantId: string): Promise<DomainInventoryEntity[]>;
  findAll(): Promise<DomainInventoryEntity[]>;
  findWithPagination(query: {
    warehouseId?: string;
    variantId?: string;
    unitId?: string;
    status?: InventoryStatus;
    limit?: number;
    page?: number;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }>;
  create(inventory: DomainInventoryEntity): Promise<DomainInventoryEntity>;
  update(id: string, inventory: Partial<DomainInventoryEntity>): Promise<DomainInventoryEntity>;
  delete(id: string): Promise<void>;
  checkIn(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
    batch?: string,
  ): Promise<DomainInventoryEntity>;
  checkOut(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
  ): Promise<DomainInventoryEntity>;
  transfer(
    fromWarehouseId: string,
    toWarehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
  ): Promise<{ fromInventory: DomainInventoryEntity; toInventory: DomainInventoryEntity }>;
  adjustInventory(
    warehouseId: string,
    variantId: string,
    unitId: string,
    adjustmentQuantity: number,
    reason: string,
    notes?: string,
  ): Promise<DomainInventoryEntity>;
  writeOff(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    reason: string,
    notes?: string,
  ): Promise<DomainInventoryEntity>;
  physicalCountAdjustment(
    warehouseId: string,
    variantId: string,
    unitId: string,
    physicalCount: number,
    reason?: string,
    notes?: string,
  ): Promise<DomainInventoryEntity>;
}

export class InventoryManagementUseCaseImpl implements InventoryManagementUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async findById(id: string): Promise<DomainInventoryEntity> {
    return await this.inventoryRepository.findByIdInventory(id);
  }

  async findByWarehouse(warehouseId: string): Promise<DomainInventoryEntity[]> {
    // Validate warehouse exists
    await this.warehouseRepository.findByIdWarehouse(warehouseId);

    const result = await this.inventoryRepository.findWithPagination({
      warehouseId,
      limit: 1000, // Large limit to get all inventory
    });
    return result.data;
  }

  async findByVariant(variantId: string): Promise<DomainInventoryEntity[]> {
    const result = await this.inventoryRepository.findWithPagination({
      variantId,
      limit: 1000, // Large limit to get all inventory
    });
    return result.data;
  }

  async findAll(): Promise<DomainInventoryEntity[]> {
    return await this.inventoryRepository.findAllInventories();
  }

  async findWithPagination(query: {
    warehouseId?: string;
    variantId?: string;
    unitId?: string;
    status?: InventoryStatus;
    limit?: number;
    page?: number;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }> {
    return this.inventoryRepository.findWithPagination(query);
  }

  async create(inventory: DomainInventoryEntity): Promise<DomainInventoryEntity> {
    // Validate warehouse exists
    await this.warehouseRepository.findByIdWarehouse(inventory.getWarehouse());

    // Validate required fields
    if (!inventory.getWarehouse() || inventory.getWarehouse().trim().length === 0) {
      throw new Error('Warehouse ID is required');
    }

    if (!inventory.getVariant() || inventory.getVariant().trim().length === 0) {
      throw new Error('Variant ID is required');
    }

    if (inventory.getQuantity() <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    return await this.inventoryRepository.saveAndReturnDomain(inventory);
  }

  async update(
    id: string,
    inventory: Partial<DomainInventoryEntity>,
  ): Promise<DomainInventoryEntity> {
    // Check if inventory exists
    const existingInventory = await this.inventoryRepository.findByIdInventory(id);
    if (!existingInventory) {
      throw new Error(`Inventory with id ${id} not found`);
    }

    // If updating warehouse, validate it exists
    if (inventory.getWarehouse && inventory.getWarehouse() !== existingInventory.getWarehouse()) {
      await this.warehouseRepository.findByIdWarehouse(inventory.getWarehouse());
    }

    // Validate quantity if provided
    if (inventory.getQuantity !== undefined && inventory.getQuantity() < 0) {
      throw new Error('Quantity cannot be negative');
    }

    return await this.inventoryRepository.updateAndReturnDomain(id, inventory);
  }

  async delete(id: string): Promise<void> {
    // Check if inventory exists
    const existingInventory = await this.inventoryRepository.findByIdInventory(id);
    if (!existingInventory) {
      throw new Error(`Inventory with id ${id} not found`);
    }

    // Check if inventory has quantity > 0
    if (existingInventory.getQuantity() > 0) {
      throw new Error('Cannot delete inventory with quantity greater than 0');
    }

    return await this.inventoryRepository.deleteInventory(id);
  }

  async checkIn(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
    batch?: string,
  ): Promise<DomainInventoryEntity> {
    // Validate warehouse exists
    const warehouse = await this.warehouseRepository.findByIdWarehouse(warehouseId);

    // Note: Variant validation is now handled by the product service
    // We assume variant exists when called from the product service

    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Check-in quantity must be greater than 0');
    }

    // Create inventory record
    const inventory = new DomainInventoryEntity({
      warehouseId,
      variantId,
      unitId,
      quantity,
      status,
      expirationDate,
      batch,
    });

    return await this.inventoryRepository.checkInInventory(
      warehouse,
      { id: variantId } as any, // TODO: Get actual variant entity
      { id: unitId } as any, // TODO: Get actual unit entity
      quantity,
      status,
      expirationDate,
      batch,
    );
  }

  async checkOut(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
  ): Promise<DomainInventoryEntity> {
    // Validate warehouse exists
    const warehouse = await this.warehouseRepository.findByIdWarehouse(warehouseId);

    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Check-out quantity must be greater than 0');
    }

    // Check if sufficient inventory exists
    const existingInventory = await this.inventoryRepository.findByWarehouseAndVariant(
      warehouseId,
      variantId,
      unitId,
      status,
    );

    if (!existingInventory || existingInventory.getQuantity() < quantity) {
      throw new Error('Insufficient inventory for check-out');
    }

    return await this.inventoryRepository.checkOutInventory(
      warehouse,
      { id: variantId } as any, // TODO: Get actual variant entity
      { id: unitId } as any, // TODO: Get actual unit entity
      quantity,
      status,
    );
  }

  async transfer(
    fromWarehouseId: string,
    toWarehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
  ): Promise<{ fromInventory: DomainInventoryEntity; toInventory: DomainInventoryEntity }> {
    // Validate both warehouses exist
    const fromWarehouse = await this.warehouseRepository.findByIdWarehouse(fromWarehouseId);
    const toWarehouse = await this.warehouseRepository.findByIdWarehouse(toWarehouseId);

    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Transfer quantity must be greater than 0');
    }

    // Check if source warehouse has sufficient inventory
    const sourceInventory = await this.inventoryRepository.findByWarehouseAndVariant(
      fromWarehouseId,
      variantId,
      unitId,
      status,
    );

    if (!sourceInventory || sourceInventory.getQuantity() < quantity) {
      throw new Error('Insufficient inventory in source warehouse for transfer');
    }

    // Perform transfer
    const result = await this.inventoryRepository.transferInventory(
      fromWarehouse,
      toWarehouse,
      { id: variantId } as any, // TODO: Get actual variant entity
      { id: unitId } as any, // TODO: Get actual unit entity
      status,
      quantity,
    );

    // The repository returns an array with [fromInventory, toInventory]
    return {
      fromInventory: result[0],
      toInventory: result[1],
    };
  }

  async adjustInventory(
    warehouseId: string,
    variantId: string,
    unitId: string,
    adjustmentQuantity: number,
    reason: string,
    notes?: string,
  ): Promise<DomainInventoryEntity> {
    // Validate warehouse exists
    await this.warehouseRepository.findByIdWarehouse(warehouseId);

    // Validate required fields
    if (!reason || reason.trim().length === 0) {
      throw new Error('Adjustment reason is required');
    }

    if (adjustmentQuantity === 0) {
      throw new Error('Adjustment quantity cannot be zero');
    }

    // Find existing inventory record
    const existingInventory = await this.inventoryRepository.findByWarehouseAndVariant(
      warehouseId,
      variantId,
      unitId,
      InventoryStatus.AVAILABLE, // Default to available status for adjustments
    );

    let updatedInventory: DomainInventoryEntity;

    if (existingInventory) {
      // Update existing inventory
      const newQuantity = existingInventory.getQuantity() + adjustmentQuantity;

      if (newQuantity < 0) {
        throw new Error('Adjustment would result in negative inventory');
      }

      updatedInventory = await this.inventoryRepository.updateAndReturnDomain(
        existingInventory.getId(),
        { quantity: newQuantity } as any,
      );
    } else if (adjustmentQuantity > 0) {
      // Create new inventory record for positive adjustments
      const inventory = new DomainInventoryEntity({
        warehouseId,
        variantId,
        unitId,
        quantity: adjustmentQuantity,
        status: InventoryStatus.AVAILABLE,
      });

      updatedInventory = await this.inventoryRepository.saveAndReturnDomain(inventory);
    } else {
      throw new Error('Cannot adjust non-existent inventory with negative quantity');
    }

    // TODO: Log the adjustment for audit trail with reason and notes

    return updatedInventory;
  }

  async writeOff(
    warehouseId: string,
    variantId: string,
    unitId: string,
    quantity: number,
    reason: string,
    notes?: string,
  ): Promise<DomainInventoryEntity> {
    // Validate warehouse exists
    await this.warehouseRepository.findByIdWarehouse(warehouseId);

    // Validate required fields
    if (!reason || reason.trim().length === 0) {
      throw new Error('Write-off reason is required');
    }

    if (quantity <= 0) {
      throw new Error('Write-off quantity must be greater than 0');
    }

    // Find existing inventory record
    const existingInventory = await this.inventoryRepository.findByWarehouseAndVariant(
      warehouseId,
      variantId,
      unitId,
      InventoryStatus.AVAILABLE,
    );

    if (!existingInventory) {
      throw new Error('No inventory found to write off');
    }

    if (existingInventory.getQuantity() < quantity) {
      throw new Error('Insufficient inventory quantity for write-off');
    }

    // Update inventory by reducing quantity
    const newQuantity = existingInventory.getQuantity() - quantity;
    const updatedInventory = await this.inventoryRepository.updateAndReturnDomain(
      existingInventory.getId(),
      { quantity: newQuantity } as any,
    );

    // TODO: Log the write-off for audit trail with reason and notes
    // TODO: Consider moving written-off inventory to a separate status/location

    return updatedInventory;
  }

  async physicalCountAdjustment(
    warehouseId: string,
    variantId: string,
    unitId: string,
    physicalCount: number,
    reason?: string,
    notes?: string,
  ): Promise<DomainInventoryEntity> {
    // Validate warehouse exists
    await this.warehouseRepository.findByIdWarehouse(warehouseId);

    if (physicalCount < 0) {
      throw new Error('Physical count cannot be negative');
    }

    // Find existing inventory record
    const existingInventory = await this.inventoryRepository.findByWarehouseAndVariant(
      warehouseId,
      variantId,
      unitId,
      InventoryStatus.AVAILABLE,
    );

    let updatedInventory: DomainInventoryEntity;

    if (existingInventory) {
      const systemCount = existingInventory.getQuantity();
      const adjustment = physicalCount - systemCount;

      if (adjustment === 0) {
        // No adjustment needed
        return existingInventory;
      }

      // Update to physical count
      updatedInventory = await this.inventoryRepository.updateAndReturnDomain(
        existingInventory.getId(),
        { quantity: physicalCount } as any,
      );

      // TODO: Log the physical count adjustment for audit trail
      // Include: systemCount, physicalCount, adjustment amount, reason, notes
    } else if (physicalCount > 0) {
      // Create new inventory record based on physical count
      const inventory = new DomainInventoryEntity({
        warehouseId,
        variantId,
        unitId,
        quantity: physicalCount,
        status: InventoryStatus.AVAILABLE,
      });

      updatedInventory = await this.inventoryRepository.saveAndReturnDomain(inventory);

      // TODO: Log the new inventory creation from physical count
    } else {
      // Physical count is 0 and no system record exists - nothing to do
      throw new Error('No inventory adjustment needed - both physical and system counts are zero');
    }

    return updatedInventory;
  }
}
