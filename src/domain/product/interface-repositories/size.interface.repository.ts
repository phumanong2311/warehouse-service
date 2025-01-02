import { DomainSizeEntity } from '../entities';

export interface ISizeRepository {
  findById(id: string): Promise<DomainSizeEntity>;
  findAll(): Promise<DomainSizeEntity[]>;
  findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainSizeEntity[]; total: number }>;
  save(warehouse: DomainSizeEntity): Promise<DomainSizeEntity>;
  update(id: string, entity: DomainSizeEntity): Promise<DomainSizeEntity>;
  delete(entity: DomainSizeEntity): Promise<void>;
}
