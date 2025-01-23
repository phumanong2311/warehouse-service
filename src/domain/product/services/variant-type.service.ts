import { VariantTypeRepository } from '@infra/postgresql/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { DomainVariantTypeEntity } from '../entities';
import { IVariantTypeRepository } from '../interface-repositories';

@Injectable()
export class VariantTypeService {
  constructor(
    @Inject(VariantTypeRepository)
    private readonly variantTypeRepository: IVariantTypeRepository,
  ) {}
  async findById(id: string): Promise<DomainVariantTypeEntity> {
    return await this.variantTypeRepository.findByIdVariantType(id);
  }
  async findAll(): Promise<DomainVariantTypeEntity[]> {
    return await this.variantTypeRepository.findAllVariantTypes();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantTypeEntity[]; total: number }> {
    return this.variantTypeRepository.findWithPagination(query);
  }
  async create(product: DomainVariantTypeEntity) {
    return this.variantTypeRepository.saveAndReturnDomain(product);
  }
  async update(
    id: string,
    variant: Partial<DomainVariantTypeEntity>,
  ): Promise<DomainVariantTypeEntity> {
    const isExit = await this.variantTypeRepository.findByIdVariantType(id);
    if (!isExit) {
      throw new Error(`Variant Type with id ${id} not found`);
    }
    return this.variantTypeRepository.updateAndReturnDomain(id, variant);
  }
  async delete(id: string): Promise<void> {
    return this.variantTypeRepository.deleteVariantType(id);
  }
}
