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
  static entityDomainToInfra(
    domain: Partial<DomainVariantEntity>,
  ): InfraVariant {
    const infra = new InfraVariant();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getProduct())
      infra.product = ProductMapper.entityDomainToInfra(domain.getProduct());
    if (domain.getVariantValue())
      infra.variantValue = VariantValueMapper.entityDomainToInfra(
        domain.getVariantValue(),
      );
    if (domain.getCreatedAt()) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt()) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy()) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy()) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
