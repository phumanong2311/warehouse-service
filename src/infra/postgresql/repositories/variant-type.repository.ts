import { DomainVariantTypeEntity } from '@domain/product/entities';
import { VariantTypeMapper } from '@domain/product/mapper';
import { VariantType } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class VariantTypeRepository extends BaseRepository<VariantType> {
  async findByIdVariantType(id: string): Promise<DomainVariantTypeEntity> {
    const data = await this.findById(id);
    return VariantTypeMapper.entityInfraToDomain(data);
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantTypeEntity[]; total: number }> {
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map(VariantTypeMapper.entityInfraToDomain);
    return { data: mappedData, total };
  }

  async findAllVariantType(): Promise<DomainVariantTypeEntity[]> {
    const data = await this.findAll();
    return data.map(VariantTypeMapper.entityInfraToDomain);
  }

  async saveAndReturnDomain(
    variant: DomainVariantTypeEntity,
  ): Promise<DomainVariantTypeEntity> {
    const entity = VariantTypeMapper.entityDomainToInfra(variant);
    const savedEntity = await this.save(entity);
    return VariantTypeMapper.entityInfraToDomain(savedEntity);
  }

  async updateAndReturnDomain(
    id: string,
    variant: DomainVariantTypeEntity,
  ): Promise<DomainVariantTypeEntity> {
    const entity = VariantTypeMapper.entityDomainToInfra(variant);
    const updatedEntity = await this.update(id, entity);
    return VariantTypeMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteVariantType(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.delete(entity);
  }
}
