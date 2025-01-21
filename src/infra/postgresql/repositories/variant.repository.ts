import { DomainVariantEntity } from '@domain/product/entities';
import { VariantMapper } from '@domain/product/mapper';
import { Variant } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class VariantRepository extends BaseRepository<Variant> {
  async findByIdVariant(id: string): Promise<DomainVariantEntity> {
    const data = await this.findById(id);
    return VariantMapper.entityInfraToDomain(data);
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantEntity[]; total: number }> {
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map(VariantMapper.entityInfraToDomain);
    return { data: mappedData, total };
  }

  async findAllVariants(): Promise<DomainVariantEntity[]> {
    const data = await this.findAll();
    return data.map(VariantMapper.entityInfraToDomain);
  }

  async saveAndReturnDomain(
    variant: DomainVariantEntity,
  ): Promise<DomainVariantEntity> {
    const entity = VariantMapper.entityDomainToInfra(variant);
    const savedEntity = await this.save(entity);
    return VariantMapper.entityInfraToDomain(savedEntity);
  }

  async updateAndReturnDomain(
    id: string,
    variant: DomainVariantEntity,
  ): Promise<DomainVariantEntity> {
    const entity = VariantMapper.entityDomainToInfra(variant);
    const updatedEntity = await this.update(id, entity);
    return VariantMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteVariant(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.delete(entity);
  }
}
