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
    domain: Partial<DomainVariantValueEntity>,
  ): InfraVariantValue {
    const infra = new InfraVariantValue();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getName()) infra.name = domain.getName();
    if (domain.getVariantType())
      infra.variantType = VariantTypeMapper.entityDomainToInfra(
        domain.getVariantType(),
      );
    if (domain.getCreatedAt()) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt()) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy()) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy()) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
