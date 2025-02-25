import {
  Variant as InfraVariant,
  Product,
  Rack,
  VariantValue,
} from '@infra/postgresql/entities';
import { DomainVariantEntity } from '../entities';
import { ProductMapper } from './product.mapper';

export class VariantMapper {
  static entityInfraToDomain(infra: InfraVariant): DomainVariantEntity {
    return new DomainVariantEntity({
      id: infra.id,
      product: ProductMapper.entityInfraToDomain(infra.product),
      variantValueId: infra.variantValue.id,
      rackId: infra.rack.id,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(
    domain: Partial<DomainVariantEntity>,
    product?: Product,
    variantValue?: VariantValue,
    rack?: Rack,
  ): InfraVariant {
    const infra = new InfraVariant();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getProduct()) infra.product = product;
    if (domain.getVariantValue()) infra.variantValue = variantValue;
    if (domain.getRack() && rack) infra.rack = rack;
    if (domain.getCreatedAt()) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt()) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy()) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy()) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
