import { VariantValue as InfraVariantValue } from '@infra/postgresql/entities';
import { DomainVariantValueEntity } from '../entities';
import { VariantTypeMapper } from './variant-type.mapper';

export class VariantValueMapper {
  static entityInfraToDomain(
    infra: InfraVariantValue,
  ): DomainVariantValueEntity {
    return new DomainVariantValueEntity({
      id: infra.id,
      name: infra.name,
      variantType: VariantTypeMapper.entityInfraToDomain(infra.variantType),
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(
    domain: DomainVariantValueEntity,
  ): InfraVariantValue {
    const infra = new InfraVariantValue();
    infra.id = domain.getId();
    infra.name = domain.getName();
    infra.variantType = VariantTypeMapper.entityDomainToInfra(
      domain.getVariantType(),
    );
    infra.createdAt = domain.getCreatedAt();
    infra.updatedAt = domain.getUpdatedAt();
    infra.createdBy = domain.getCreatedBy();
    infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
