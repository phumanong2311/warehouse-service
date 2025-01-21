import { DomainVariantValueEntity } from '../entities';

export interface IVariantValueRepository {
  findByIdVariantValue(id: string): Promise<DomainVariantValueEntity>;
  findByVariantType(variantTypeId: string): Promise<DomainVariantValueEntity[]>;
  findAllVariantValues(): Promise<DomainVariantValueEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantValueEntity[]; total: number }>;
  saveAndReturnDomain(
    variant: DomainVariantValueEntity,
  ): Promise<DomainVariantValueEntity>;
  updateAndReturnDomain(
    id: string,
    entity: Partial<DomainVariantValueEntity>,
  ): Promise<DomainVariantValueEntity>;
  deleteVariantValue(id: string): Promise<void>;
}
