import { DomainVariantTypeEntity } from '../entities';

export interface IVariantTypeRepository {
  findByIdVariantType(id: string): Promise<DomainVariantTypeEntity>;
  findAllVariantTypes(): Promise<DomainVariantTypeEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantTypeEntity[]; total: number }>;
  saveAndReturnDomain(
    variant: DomainVariantTypeEntity,
  ): Promise<DomainVariantTypeEntity>;
  updateAndReturnDomain(
    id: string,
    entity: Partial<DomainVariantTypeEntity>,
  ): Promise<DomainVariantTypeEntity>;
  deleteVariantType(id: string): Promise<void>;
}
