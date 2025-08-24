import { DomainWarehouseEntity } from '../../../domain/warehouse/entities';
import { IWarehouseRepository } from '../../../domain/warehouse/interface-repositories/warehouse.interface.repository';

export interface FindWarehouseUseCase {
  findById(id: string): Promise<DomainWarehouseEntity>;
  findByCode(code: string): Promise<DomainWarehouseEntity>;
  findAll(): Promise<DomainWarehouseEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }>;
}

export class FindWarehouseUseCaseImpl implements FindWarehouseUseCase {
  constructor(private readonly warehouseRepository: IWarehouseRepository) {}

  async findById(id: string): Promise<DomainWarehouseEntity> {
    return await this.warehouseRepository.findByIdWarehouse(id);
  }

  async findByCode(code: string): Promise<DomainWarehouseEntity> {
    return await this.warehouseRepository.findByCode(code);
  }

  async findAll(): Promise<DomainWarehouseEntity[]> {
    return await this.warehouseRepository.findAllWarehouses();
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }> {
    return this.warehouseRepository.findWithPagination(query);
  }
}
