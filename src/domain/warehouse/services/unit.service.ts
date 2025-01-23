import { UnitRepository } from '@infra/postgresql/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { DomainUnitEntity } from '../entities';
import { IUnitRepository } from '../interface-repositories';

@Injectable()
export class UnitService {
  constructor(
    @Inject(UnitRepository)
    private readonly unitRepository: IUnitRepository,
  ) {}
  async findById(variantValueId: string): Promise<DomainUnitEntity> {
    return await this.unitRepository.findByIdUnit(variantValueId);
  }
  async findAll(): Promise<DomainUnitEntity[]> {
    return await this.unitRepository.findAllUnits();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainUnitEntity[]; total: number }> {
    return this.unitRepository.findWithPagination(query);
  }
  async create(product: DomainUnitEntity) {
    return this.unitRepository.saveAndReturnDomain(product);
  }
  async update(
    id: string,
    variantValue: Partial<DomainUnitEntity>,
  ): Promise<DomainUnitEntity> {
    const isExit = await this.unitRepository.findByIdUnit(id);
    if (!isExit) {
      throw new Error(`Unit with id ${id} not found`);
    }
    return this.unitRepository.updateAndReturnDomain(id, variantValue);
  }
  async delete(id: string): Promise<void> {
    return this.unitRepository.deleteUnit(id);
  }
}
