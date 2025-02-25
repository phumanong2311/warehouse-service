import {
  VariantValue as InfraVariantValue,
  VariantType,
} from '@infra/postgresql/entities';
import { DomainVariantValueEntity } from '../entities';

export class VariantValueMapper {
  static entityInfraToDomain(
    infra: InfraVariantValue,
  ): DomainVariantValueEntity {
    return new DomainVariantValueEntity({
      id: infra.id,
      name: infra.name,
      variantTypeId: infra.variantType.id,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(
    domain: Partial<DomainVariantValueEntity>,
    variantType?: VariantType,
  ): InfraVariantValue {
    const infra = new InfraVariantValue();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getName()) infra.name = domain.getName();
    if (domain.getVariantType() && variantType) infra.variantType = variantType;
    if (domain.getCreatedAt()) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt()) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy()) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy()) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
