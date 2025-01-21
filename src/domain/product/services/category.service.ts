import { CategoryRepository } from '@infra/postgresql/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { DomainCategoryEntity } from '../entities';
import { ICategoryRepository } from '../interface-repositories';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}
  async findById(productId: string): Promise<DomainCategoryEntity> {
    return await this.categoryRepository.findById(productId);
  }
  async findAll(): Promise<DomainCategoryEntity[]> {
    return await this.categoryRepository.findAll();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainCategoryEntity[]; total: number }> {
    return this.categoryRepository.findPagination(query);
  }
  async create(category: DomainCategoryEntity) {
    return this.categoryRepository.saveAndReturnDomain(category);
  }
  async update(
    id: string,
    category: Partial<DomainCategoryEntity>,
  ): Promise<DomainCategoryEntity> {
    const isExit = await this.categoryRepository.findById(id);
    if (!isExit) {
      throw new Error(`Category with id ${id} not found`);
    }
    return this.categoryRepository.updateAndReturnDomain(id, category);
  }
  async delete(id: string): Promise<void> {
    return this.categoryRepository.deleteProduct(id);
  }
}
