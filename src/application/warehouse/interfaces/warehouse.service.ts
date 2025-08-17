import { PaginationWarehouseDto } from '../dtos/pagination-warehouse.dto';
import { DomainWarehouseEntity } from '../../../domain/warehouse/entities/warehouse.entity';

export interface IWarehouseService {
  findByIdWarehouse(warehouseId: string): Promise<DomainWarehouseEntity>;
  findAll(): Promise<DomainWarehouseEntity[]>;
  findWithPagination(query: PaginationWarehouseDto): Promise<{ data: DomainWarehouseEntity[]; total: number }>;
  create(warehouse: DomainWarehouseEntity): Promise<DomainWarehouseEntity>;
  update(id: string, warehouse: Partial<DomainWarehouseEntity>): Promise<DomainWarehouseEntity>;
  delete(id: string): Promise<void>;
}
