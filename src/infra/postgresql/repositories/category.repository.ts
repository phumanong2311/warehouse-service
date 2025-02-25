import { DomainCategoryEntity } from '@domain/product/entities';
import { CategoryMapper } from '@domain/product/mapper';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Category } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class CategoryRepository extends BaseRepository<Category> {
  constructor(em: SqlEntityManager) {
    super(em, Category);
  }
  async findByIdCategory(id: string): Promise<DomainCategoryEntity> {
    const data = await this.findById(id);
    return CategoryMapper.entityInfraToDomain(data);
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainCategoryEntity[]; total: number }> {
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map(CategoryMapper.entityInfraToDomain);
    return { data: mappedData, total };
  }

  async findAllCategories(): Promise<DomainCategoryEntity[]> {
    const data = await this.findAll();
    return data.map(CategoryMapper.entityInfraToDomain);
  }

  async saveAndReturnDomain(
    product: DomainCategoryEntity,
  ): Promise<DomainCategoryEntity> {
    const entity = CategoryMapper.entityDomainToInfra(product);
    const savedEntity = await this.save(entity);
    return CategoryMapper.entityInfraToDomain(savedEntity);
  }

  async updateAndReturnDomain(
    id: string,
    category: Partial<DomainCategoryEntity>,
  ): Promise<DomainCategoryEntity> {
    if (!id) {
      throw new Error('ID is required to update the category.');
    }
    const existingEntity = await this.findById(id);
    if (!existingEntity) {
      throw new Error(`Category with ID ${id} not found.`);
    }
    const updatedData = { ...existingEntity, ...category };
    const entityToUpdate = CategoryMapper.entityDomainToInfra(updatedData);
    const updatedEntity = await this.update(id, entityToUpdate);
    return CategoryMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteCategory(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.delete(entity);
  }
}
