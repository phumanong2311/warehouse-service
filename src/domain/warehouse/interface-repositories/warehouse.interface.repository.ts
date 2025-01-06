import { DomainWarehouseEntity } from '../entities';

export interface IWarehouseRepository {
  findByIdWithMapper(id: string): Promise<DomainWarehouseEntity>;
  findPaginationWithMapper(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }>;
  findAllWithMapper(): Promise<DomainWarehouseEntity[]>;
  findByCodeWithMapper(code: string): Promise<DomainWarehouseEntity>;
  saveAndReturnDomain(warehouse: DomainWarehouseEntity): Promise<DomainWarehouseEntity>;
  updateAndReturnDomain(id: string, warehouse: Partial<DomainWarehouseEntity>): Promise<DomainWarehouseEntity>;
  deleteWarehouse(id: string): Promise<void>;
}
