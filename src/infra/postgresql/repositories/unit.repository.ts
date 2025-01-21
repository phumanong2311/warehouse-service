import { DomainUnitEntity } from '@domain/warehouse/entities';
import { UnitMapper } from '@domain/warehouse/mapper';
import { Unit } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class UnitRepository extends BaseRepository<Unit> {
  async findByIdUnit(id: string): Promise<DomainUnitEntity> {
    const data = await this.findById(id);
    return UnitMapper.entityInfraToDomain(data);
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainUnitEntity[]; total: number }> {
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map(UnitMapper.entityInfraToDomain);
    return { data: mappedData, total };
  }

  async findAllUnits(): Promise<DomainUnitEntity[]> {
    const data = await this.findAll();
    return data.map(UnitMapper.entityInfraToDomain);
  }

  async saveAndReturnDomain(unit: DomainUnitEntity): Promise<DomainUnitEntity> {
    const entity = UnitMapper.entityDomainToInfra(unit);
    const savedEntity = await this.save(entity);
    return UnitMapper.entityInfraToDomain(savedEntity);
  }

  async updateAndReturnDomain(
    id: string,
    unit: DomainUnitEntity,
  ): Promise<DomainUnitEntity> {
    const entity = UnitMapper.entityDomainToInfra(unit);
    const updatedEntity = await this.update(id, entity);
    return UnitMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteUnit(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.delete(entity);
  }
}
