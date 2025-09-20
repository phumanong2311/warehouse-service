import { DomainWarehouseEntity } from '../entities';
import { PaginationQuery, PaginationResult } from '../interfaces/pagination.interface';

export interface IWarehouseRepository {
  findByIdWarehouse(id: string): Promise<DomainWarehouseEntity>;
  findByCode(code: string): Promise<DomainWarehouseEntity>;
  findWithPagination(query: PaginationQuery): Promise<PaginationResult<DomainWarehouseEntity>>;
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
