import { DomainVariantTypeEntity } from '../entities';

export interface IVariantTypeRepository {
  findById(id: string): Promise<DomainVariantTypeEntity>;
  findAll(): Promise<DomainVariantTypeEntity[]>;
  findPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantTypeEntity[]; total: number }>;
  save(warehouse: DomainVariantTypeEntity): Promise<DomainVariantTypeEntity>;
  update(id: string, entity: DomainVariantTypeEntity): Promise<DomainVariantTypeEntity>;
  delete(entity: DomainVariantTypeEntity): Promise<void>;
}
