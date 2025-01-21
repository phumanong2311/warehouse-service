import { DomainRackEntity } from '../entities';

export interface IRackRepository {
  findById(id: string): Promise<DomainRackEntity>;
  findAll(): Promise<DomainRackEntity[]>;
  findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainRackEntity[]; total: number }>;
  findRackByWarehouse(warehouseId: string): Promise<DomainRackEntity>;
  findRackByProduct(productId: string): Promise<DomainRackEntity>;
  save(rack: DomainRackEntity): Promise<DomainRackEntity>;
  update(id: string, entity: DomainRackEntity): Promise<DomainRackEntity>;
  delete(id: string): Promise<void>;
}
