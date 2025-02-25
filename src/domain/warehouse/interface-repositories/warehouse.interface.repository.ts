import { DomainWarehouseEntity } from '../entities';

export interface IWarehouseRepository {
  findByIdWarehouse(id: string): Promise<DomainWarehouseEntity>;
  findByCode(code: string): Promise<DomainWarehouseEntity>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }>;
  findAllWarehouses(): Promise<DomainWarehouseEntity[]>;
  saveAndReturnDomain(
    warehouse: DomainWarehouseEntity,
  ): Promise<DomainWarehouseEntity>;
  updateAndReturnDomain(
    id: string,
    warehouse: Partial<DomainWarehouseEntity>,
  ): Promise<DomainWarehouseEntity>;
  deleteWarehouse(id: string): Promise<void>;
}
