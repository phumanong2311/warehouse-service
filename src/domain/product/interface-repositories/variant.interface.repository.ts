import { DomainVariantEntity } from '../entities';

export interface IVariantRepository {
  findById(id: string): Promise<DomainVariantEntity>;
  findAll(): Promise<DomainVariantEntity[]>;
  findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantEntity[]; total: number }>;
  save(warehouse: DomainVariantEntity): Promise<DomainVariantEntity>;
  update(id: string, entity: DomainVariantEntity): Promise<DomainVariantEntity>;
  delete(entity: DomainVariantEntity): Promise<void>;
}
