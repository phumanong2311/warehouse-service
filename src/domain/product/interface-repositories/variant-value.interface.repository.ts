import { DomainVariantValueEntity } from '../entities';

export interface IVariantValueRepository {
  findById(id: string): Promise<DomainVariantValueEntity>;
  findAll(): Promise<DomainVariantValueEntity[]>;
  findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantValueEntity[]; total: number }>;
  save(warehouse: DomainVariantValueEntity): Promise<DomainVariantValueEntity>;
  update(
    id: string,
    entity: DomainVariantValueEntity,
  ): Promise<DomainVariantValueEntity>;
  delete(entity: DomainVariantValueEntity): Promise<void>;
}
