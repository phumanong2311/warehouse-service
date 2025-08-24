import { DomainInventoryEntity, DomainUnitEntity, DomainWarehouseEntity } from '../../../domain/warehouse/entities';
import { IInventoryRepository } from '../../../domain/warehouse/interface-repositories/inventory.interface.repository';
import { IWarehouseRepository } from '../../../domain/warehouse/interface-repositories/warehouse.interface.repository';
import { IProductRepository } from '../../../domain/product/interface-repositories/product.interface.repository';
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
}

export class InventoryManagementUseCaseImpl implements InventoryManagementUseCase {
  constructor(
    private readonly inventoryRepository: IInventoryRepository,
    private readonly warehouseRepository: IWarehouseRepository,
    private readonly productRepository: IProductRepository,
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
    await this.warehouseRepository.findByIdWarehouse(inventory.getWarehouseId());

    // Validate required fields
    if (!inventory.getWarehouseId() || inventory.getWarehouseId().trim().length === 0) {
      throw new Error('Warehouse ID is required');
    }

    if (!inventory.getVariantId() || inventory.getVariantId().trim().length === 0) {
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
    if (inventory.getWarehouseId && inventory.getWarehouseId() !== existingInventory.getWarehouseId()) {
      await this.warehouseRepository.findByIdWarehouse(inventory.getWarehouseId());
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

    // Validate variant exists (through product)
    // TODO: Add variant repository to validate variant directly
    // For now, we'll assume variant exists

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
      quantity,
      status,
    );

    return {
      fromInventory: result.fromInventory,
      toInventory: result.toInventory,
    };
  }
}
