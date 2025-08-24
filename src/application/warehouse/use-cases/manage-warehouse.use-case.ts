import { DomainWarehouseEntity } from '../../../domain/warehouse/entities';
import { IWarehouseRepository } from '../../../domain/warehouse/interface-repositories/warehouse.interface.repository';

export interface ManageWarehouseUseCase {
  create(warehouse: DomainWarehouseEntity): Promise<DomainWarehouseEntity>;
  update(id: string, warehouse: Partial<DomainWarehouseEntity>): Promise<DomainWarehouseEntity>;
  delete(id: string): Promise<void>;
}

export class ManageWarehouseUseCaseImpl implements ManageWarehouseUseCase {
  constructor(private readonly warehouseRepository: IWarehouseRepository) {}

  async create(warehouse: DomainWarehouseEntity): Promise<DomainWarehouseEntity> {
    // Validate warehouse code uniqueness
    const existingWarehouse = await this.warehouseRepository.findByCode(warehouse.getCode());
    if (existingWarehouse) {
      throw new Error(`Warehouse with code ${warehouse.getCode()} already exists`);
    }

    // Validate required fields
    if (!warehouse.getCode() || warehouse.getCode().trim().length === 0) {
      throw new Error('Warehouse code is required');
    }

    if (!warehouse.getName() || warehouse.getName().trim().length === 0) {
      throw new Error('Warehouse name is required');
    }

    if (!warehouse.getPhone() || warehouse.getPhone().trim().length === 0) {
      throw new Error('Warehouse phone number is required');
    }

    if (!warehouse.getEmail() || warehouse.getEmail().trim().length === 0) {
      throw new Error('Warehouse email is required');
    }

    if (!warehouse.getAddress() || warehouse.getAddress().trim().length === 0) {
      throw new Error('Warehouse address is required');
    }

    return await this.warehouseRepository.saveAndReturnDomain(warehouse);
  }

  async update(
    id: string,
    warehouse: Partial<DomainWarehouseEntity>,
  ): Promise<DomainWarehouseEntity> {
    // Check if warehouse exists
    const existingWarehouse = await this.warehouseRepository.findByIdWarehouse(id);
    if (!existingWarehouse) {
      throw new Error(`Warehouse with id ${id} not found`);
    }

    // If updating code, check uniqueness
    if (warehouse.getCode && warehouse.getCode() !== existingWarehouse.getCode()) {
      const warehouseWithSameCode = await this.warehouseRepository.findByCode(warehouse.getCode());
      if (warehouseWithSameCode) {
        throw new Error(`Warehouse with code ${warehouse.getCode()} already exists`);
      }
    }

    return await this.warehouseRepository.updateAndReturnDomain(id, warehouse);
  }

  async delete(id: string): Promise<void> {
    // Check if warehouse exists
    const existingWarehouse = await this.warehouseRepository.findByIdWarehouse(id);
    if (!existingWarehouse) {
      throw new Error(`Warehouse with id ${id} not found`);
    }

    // TODO: Add business rule to check if warehouse has active inventory
    // This would require checking inventory repository

    return await this.warehouseRepository.deleteWarehouse(id);
  }
}
