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
    domain: DomainVariantTypeEntity,
  ): InfraVariantType {
    const infra = new InfraVariantType();
    infra.id = domain.getId();
    infra.name = domain.getName();
    infra.createdAt = domain.getCreatedAt();
    infra.updatedAt = domain.getUpdatedAt();
    infra.createdBy = domain.getCreatedBy();
    infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
