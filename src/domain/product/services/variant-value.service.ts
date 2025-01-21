import { VariantValueRepository } from '@infra/postgresql/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { DomainVariantValueEntity } from '../entities';
import { IVariantValueRepository } from '../interface-repositories';

@Injectable()
export class VariantValueService {
  constructor(
    @Inject(VariantValueRepository)
    private readonly variantValueRepository: IVariantValueRepository,
  ) {}
  async findById(variantValueId: string): Promise<DomainVariantValueEntity> {
    return await this.variantValueRepository.findById(variantValueId);
  }
  async findAll(): Promise<DomainVariantValueEntity[]> {
    return await this.variantValueRepository.findAll();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantValueEntity[]; total: number }> {
    return this.variantValueRepository.findPagination(query);
  }
  async create(product: DomainVariantValueEntity) {
    return this.variantValueRepository.saveAndReturnDomain(product);
  }
  async update(
    id: string,
    variantValue: Partial<DomainVariantValueEntity>,
  ): Promise<DomainVariantValueEntity> {
    const isExit = await this.variantValueRepository.findById(id);
    if (!isExit) {
      throw new Error(`Variant Value with id ${id} not found`);
    }
    return this.variantValueRepository.updateAndReturnDomain(id, variantValue);
  }
  async delete(id: string): Promise<void> {
    return this.variantValueRepository.deleteVariantValue(id);
  }
}
