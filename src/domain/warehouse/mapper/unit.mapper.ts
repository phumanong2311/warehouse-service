import { Unit as InfraUnit } from '@infra/postgresql/entities';
import { DomainUnitEntity } from '../entities';

export class UnitMapper {
  static entityInfraToDomain(infra: InfraUnit): DomainUnitEntity {
    return new DomainUnitEntity({
      id: infra.id,
      name: infra.name,
      description: infra.description,
      conversionRate: infra.conversionRate,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(domain: Partial<DomainUnitEntity>): InfraUnit {
    const infra = new InfraUnit();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getName()) infra.name = domain.getName();
    if (domain.getDescription()) infra.description = domain.getDescription();
    if (domain.getConversionRate())
      infra.conversionRate = domain.getConversionRate();
    if (domain.getCreatedAt) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
