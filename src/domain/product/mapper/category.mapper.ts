import { Category as InfraCategory } from '@infra/postgresql/entities';
import { DomainCategoryEntity } from '../entities';

export class CategoryMapper {
  static entityInfraToDomain(infra: InfraCategory): DomainCategoryEntity {
    return new DomainCategoryEntity({
      id: infra.id,
      name: infra.name,
      description: infra.description,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(
    domain: Partial<DomainCategoryEntity>,
  ): InfraCategory {
    const infra = new InfraCategory();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getName()) infra.name = domain.getName();
    if (domain.getDescription()) infra.description = domain.getDescription();
    if (domain.getCreatedAt()) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt()) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy()) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy()) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
