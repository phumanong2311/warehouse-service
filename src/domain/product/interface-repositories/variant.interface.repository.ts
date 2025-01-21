import { DomainVariantEntity } from '../entities';

export interface IVariantRepository {
  findByIdVariant(id: string): Promise<DomainVariantEntity>;
  findAllVariants(): Promise<DomainVariantEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantEntity[]; total: number }>;
  saveAndReturnDomain(
    variant: DomainVariantEntity,
  ): Promise<DomainVariantEntity>;
  updateAndReturnDomain(
    id: string,
    entity: Partial<DomainVariantEntity>,
  ): Promise<DomainVariantEntity>;
  deleteVariant(id: string): Promise<void>;
}
