import { DomainWarehouseEntity } from '../entities';

export interface IWarehouseRepository {
  findById(id: string): Promise<DomainWarehouseEntity>;
  findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }>;
  findAll(): Promise<DomainWarehouseEntity[]>;
  findByCode(code: string): Promise<DomainWarehouseEntity>;
  saveAndReturnDomain(
    warehouse: DomainWarehouseEntity,
  ): Promise<DomainWarehouseEntity>;
  updateAndReturnDomain(
    id: string,
    warehouse: Partial<DomainWarehouseEntity>,
  ): Promise<DomainWarehouseEntity>;
  deleteWarehouse(id: string): Promise<void>;
}
