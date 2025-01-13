import { DomainCategoryEntity } from '../entities';

export interface ICategoryRepository {
  findById(id: string): Promise<DomainCategoryEntity>;
  findAll(): Promise<DomainCategoryEntity[]>;
  findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainCategoryEntity[]; total: number }>;
  save(warehouse: DomainCategoryEntity): Promise<DomainCategoryEntity>;
  update(
    id: string,
    entity: DomainCategoryEntity,
  ): Promise<DomainCategoryEntity>;
  delete(entity: DomainCategoryEntity): Promise<void>;
}
