import { DomainVariantValueEntity } from '@domain/product/entities';
import { VariantValueMapper } from '@domain/product/mapper';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { VariantValue } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class VariantValueRepository extends BaseRepository<VariantValue> {
  constructor(em: SqlEntityManager) {
    super(em, VariantValue);
  }
  async findByIdVariantValue(id: string): Promise<DomainVariantValueEntity> {
    const data = await this.findById(id);
    return VariantValueMapper.entityInfraToDomain(data);
  }

  async findByVariantType(
    variantTypeId: string,
  ): Promise<DomainVariantValueEntity[]> {
    const data = await this.find({ variantType: variantTypeId });
    return data.map((item) => VariantValueMapper.entityInfraToDomain(item));
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainVariantValueEntity[]; total: number }> {
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map(VariantValueMapper.entityInfraToDomain);
    return { data: mappedData, total };
  }

  async findAllVariantValues(): Promise<DomainVariantValueEntity[]> {
    const data = await this.findAll();
    return data.map(VariantValueMapper.entityInfraToDomain);
  }

  async saveAndReturnDomain(
    product: DomainVariantValueEntity,
  ): Promise<DomainVariantValueEntity> {
    const entity = VariantValueMapper.entityDomainToInfra(product);
    const savedEntity = await this.save(entity);
    return VariantValueMapper.entityInfraToDomain(savedEntity);
  }

  async updateAndReturnDomain(
    id: string,
    product: DomainVariantValueEntity,
  ): Promise<DomainVariantValueEntity> {
    const entity = VariantValueMapper.entityDomainToInfra(product);
    const updatedEntity = await this.update(id, entity);
    return VariantValueMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteVariantValue(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.delete(entity);
  }
}
