import { DomainWarehouseEntity } from '../entities';

export interface IWarehouseRepository {
  findByIdWithMapper(id: string): Promise<DomainWarehouseEntity>;
  findPaginationWithMapper(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }>;
  findAllWithMapper(): Promise<DomainWarehouseEntity[]>;
  saveAndReturnDomain(warehouse: DomainWarehouseEntity): Promise<DomainWarehouseEntity>;
  updateAndReturnDomain(id: string, warehouse: DomainWarehouseEntity): Promise<DomainWarehouseEntity>;
  deleteWarehouse(warehouse: DomainWarehouseEntity): Promise<void>;
}
