import { DomainCategoryEntity } from '../entities';
export interface ICategoryRepository {
  findByIdCategory(id: string): Promise<DomainCategoryEntity>;
  findAllCategories(): Promise<DomainCategoryEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainCategoryEntity[]; total: number }>;
  saveAndReturnDomain(
    category: DomainCategoryEntity,
  ): Promise<DomainCategoryEntity>;
  updateAndReturnDomain(
    id: string,
    entity: Partial<DomainCategoryEntity>,
  ): Promise<DomainCategoryEntity>;
  deleteCategory(id: string): Promise<void>;
}
