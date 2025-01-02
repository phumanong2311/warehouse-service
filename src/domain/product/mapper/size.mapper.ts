import { Size as InfraSize } from '@infra/postgresql/entities';
import { DomainSizeEntity } from '../entities';
import { VariantMapper } from './variant.mapper';

export class SizeMapper {
  static entityInfraToDomain(infra: InfraSize): DomainSizeEntity {
    return new DomainSizeEntity({
      id: infra.id,
      name: infra.name,
      variant: VariantMapper.entityInfraToDomain(infra.variant),
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(domain: DomainSizeEntity): InfraSize {
    const infra = new InfraSize();
    infra.id = domain.getId();
    infra.name = domain.getName();
    infra.variant = VariantMapper.entityDomainToInfra(domain.getVariant());
    infra.createdAt = domain.getCreatedAt();
    infra.updatedAt = domain.getUpdatedAt();
    infra.createdBy = domain.getCreatedBy();
    infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
