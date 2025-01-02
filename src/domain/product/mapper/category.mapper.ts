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
  static entityDomainToInfra(domain: DomainCategoryEntity): InfraCategory {
    const infra = new InfraCategory();
    infra.id = domain.getId();
    infra.name = domain.getName();
    infra.description = domain.getDescription();
    infra.createdAt = domain.getCreatedAt();
    infra.updatedAt = domain.getUpdatedAt();
    infra.createdBy = domain.getCreatedBy();
    infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
