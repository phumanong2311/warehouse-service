import { DomainRackEntity } from '../../../domain/warehouse/entities';
import { IRackRepository } from '../../../domain/warehouse/interface-repositories/rack.interface.repository';
import { IWarehouseRepository } from '../../../domain/warehouse/interface-repositories/warehouse.interface.repository';

export interface RackManagementUseCase {
  findById(id: string): Promise<DomainRackEntity>;
  findByWarehouse(warehouseId: string): Promise<DomainRackEntity[]>;
  findAll(): Promise<DomainRackEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainRackEntity[]; total: number }>;
  create(rack: DomainRackEntity): Promise<DomainRackEntity>;
  update(id: string, rack: Partial<DomainRackEntity>): Promise<DomainRackEntity>;
  delete(id: string): Promise<void>;
}

export class RackManagementUseCaseImpl implements RackManagementUseCase {
  constructor(
    private readonly rackRepository: IRackRepository,
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async findById(id: string): Promise<DomainRackEntity> {
    return await this.rackRepository.findById(id);
  }

  async findByWarehouse(warehouseId: string): Promise<DomainRackEntity[]> {
    // Validate warehouse exists
    await this.warehouseRepository.findByIdWarehouse(warehouseId);

    // TODO: Implement findRacksByWarehouse in repository
    // For now, we'll use findPagination with warehouse filter
    const result = await this.rackRepository.findPagination({
      filter: { warehouseId },
      limit: 1000, // Large limit to get all racks
    });
    return result.data;
  }

  async findAll(): Promise<DomainRackEntity[]> {
    return await this.rackRepository.findAll();
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainRackEntity[]; total: number }> {
    return this.rackRepository.findPagination(query);
  }

  async create(rack: DomainRackEntity): Promise<DomainRackEntity> {
    // Validate warehouse exists
    await this.warehouseRepository.findByIdWarehouse(rack.getWarehouse());

    // Validate required fields
    if (!rack.getName() || rack.getName().trim().length === 0) {
      throw new Error('Rack name is required');
    }

    if (!rack.getWarehouse() || rack.getWarehouse().trim().length === 0) {
      throw new Error('Warehouse ID is required');
    }

    // TODO: Validate rack name uniqueness within warehouse
    // This would require a new repository method

    return await this.rackRepository.save(rack);
  }

  async update(
    id: string,
    rack: Partial<DomainRackEntity>,
  ): Promise<DomainRackEntity> {
    // Check if rack exists
    const existingRack = await this.rackRepository.findById(id);
    if (!existingRack) {
      throw new Error(`Rack with id ${id} not found`);
    }

    // If updating warehouse, validate it exists
    if (rack.getWarehouse && rack.getWarehouse() !== existingRack.getWarehouse()) {
      await this.warehouseRepository.findByIdWarehouse(rack.getWarehouse());
    }

    // Validate name if provided
    if (rack.getName && (!rack.getName() || rack.getName().trim().length === 0)) {
      throw new Error('Rack name is required');
    }

    return await this.rackRepository.update(id, rack as DomainRackEntity);
  }

  async delete(id: string): Promise<void> {
    // Check if rack exists
    const existingRack = await this.rackRepository.findById(id);
    if (!existingRack) {
      throw new Error(`Rack with id ${id} not found`);
    }

    // TODO: Add business rule to check if rack has active inventory
    // This would require checking inventory repository

    return await this.rackRepository.delete(id);
  }
}
