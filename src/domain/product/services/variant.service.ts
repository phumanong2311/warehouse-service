import { VariantRepository } from '@infra/postgresql/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { DomainVariantEntity } from '../entities';
import { IVariantRepository } from '../interface-repositories';

@Injectable()
export class VariantService {
  constructor(
    @Inject(VariantRepository)
    private readonly variantRepository: IVariantRepository,
  ) {}
  async findById(variantValueId: string): Promise<DomainVariantEntity> {
    return await this.variantRepository.findByIdVariant(variantValueId);
  }
  async findAll(): Promise<DomainVariantEntity[]> {
    return await this.variantRepository.findAllVariants();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantEntity[]; total: number }> {
    return this.variantRepository.findWithPagination(query);
  }
  async create(product: DomainVariantEntity) {
    return this.variantRepository.saveAndReturnDomain(product);
  }
  async update(
    id: string,
    variantValue: Partial<DomainVariantEntity>,
  ): Promise<DomainVariantEntity> {
    const isExit = await this.variantRepository.findByIdVariant(id);
    if (!isExit) {
      throw new Error(`Variant Value with id ${id} not found`);
    }
    return this.variantRepository.updateAndReturnDomain(id, variantValue);
  }
  async delete(id: string): Promise<void> {
    return this.variantRepository.deleteVariant(id);
  }
}
