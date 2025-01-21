import { UnitRepository } from '@infra/postgresql/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { DomainVariantEntity } from '../entities';
import { IUnitRepository } from '../interface-repositories';

@Injectable()
export class UnitService {
  constructor(
    @Inject(UnitRepository)
    private readonly UnitRepository: IUnitRepository,
  ) {}
  async findById(variantValueId: string): Promise<DomainVariantEntity> {
    return await this.UnitRepository.findById(variantValueId);
  }
  async findAll(): Promise<DomainVariantEntity[]> {
    return await this.UnitRepository.findAll();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantEntity[]; total: number }> {
    return this.UnitRepository.findPagination(query);
  }
  async create(product: DomainVariantEntity) {
    return this.UnitRepository.saveAndReturnDomain(product);
  }
  async update(
    id: string,
    variantValue: Partial<DomainVariantEntity>,
  ): Promise<DomainVariantEntity> {
    const isExit = await this.UnitRepository.findById(id);
    if (!isExit) {
      throw new Error(`Variant Value with id ${id} not found`);
    }
    return this.UnitRepository.updateAndReturnDomain(id, variantValue);
  }
  async delete(id: string): Promise<void> {
    return this.UnitRepository.deleteVariant(id);
  }
}
