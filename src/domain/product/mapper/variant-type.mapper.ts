import { VariantType as InfraVariantType } from '@infra/postgresql/entities';
import { DomainVariantTypeEntity } from '../entities';

export class VariantTypeMapper {
  static entityInfraToDomain(infra: InfraVariantType): DomainVariantTypeEntity {
    return new DomainVariantTypeEntity({
      id: infra.id,
      name: infra.name,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(
    domain: Partial<DomainVariantTypeEntity>,
  ): InfraVariantType {
    const infra = new InfraVariantType();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getName()) infra.name = domain.getName();
    if (domain.getCreatedAt()) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt()) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy()) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy()) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
