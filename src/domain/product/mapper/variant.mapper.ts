import { Variant as InfraVariant } from '@infra/postgresql/entities';
import { DomainVariantEntity } from '../entities';
import { ProductMapper } from './product.mapper';
import { VariantValueMapper } from './variant-value.mapper';

export class VariantMapper {
  static entityInfraToDomain(infra: InfraVariant): DomainVariantEntity {
    return new DomainVariantEntity({
      id: infra.id,
      product: ProductMapper.entityInfraToDomain(infra.product),
      variantValue: VariantValueMapper.entityInfraToDomain(infra.variantValue),
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(domain: DomainVariantEntity): InfraVariant {
    const infra = new InfraVariant();
    infra.id = domain.getId();
    infra.product = ProductMapper.entityDomainToInfra(domain.getProduct());
    infra.variantValue = VariantValueMapper.entityDomainToInfra(
      domain.getVariantValue(),
    );
    infra.createdAt = domain.getCreatedAt();
    infra.updatedAt = domain.getUpdatedAt();
    infra.createdBy = domain.getCreatedBy();
    infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
