import { DomainUnitEntity } from '../entities';

export interface IVariantRepository {
  findByIdUnit(id: string): Promise<DomainUnitEntity>;
  findAllUnits(): Promise<DomainUnitEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainUnitEntity[]; total: number }>;
  saveAndReturnDomain(unit: DomainUnitEntity): Promise<DomainUnitEntity>;
  updateAndReturnDomain(
    id: string,
    entity: Partial<DomainUnitEntity>,
  ): Promise<DomainUnitEntity>;
  deleteUnit(id: string): Promise<void>;
}
