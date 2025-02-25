import { DomainProductEntity } from '@domain/product/entities/product.entity';
import { RackMapper, WarehouseMapper } from '@domain/warehouse/mapper';
import {
  Category,
  Product as InfraProduct,
  Rack,
  Variant,
  Warehouse,
} from '@infra/postgresql/entities';
import { Collection } from '@mikro-orm/core';
import { VariantMapper } from './variant.mapper';

export class ProductMapper {
  static entityInfraToDomain(infra: InfraProduct): DomainProductEntity {
    return new DomainProductEntity({
      id: infra.id,
      name: infra.name,
      sku: infra.sku,
      description: infra.description,
      categoryId: infra.category.id,
      warehouseId: infra.warehouse.id,
      variants: infra.variants.isInitialized()
        ? infra.variants.map((item) => VariantMapper.entityInfraToDomain(item))
        : [],
      rackId: infra.rack.id,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }

  static entityDomainToInfra(
    domain: Partial<DomainProductEntity>,
    category?: Category,
    warehouse?: Warehouse,
    rack?: Rack,
  ): InfraProduct {
    const infra = new InfraProduct();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getName()) infra.name = domain.getName();
    if (domain.getSku()) infra.sku = domain.getSku();
    if (domain.getDescription()) infra.description = domain.getDescription();
    if (domain.getCategory() && category) infra.category = category;
    if (domain.getWarehouse() && warehouse) infra.warehouse = warehouse;
    if (domain.getVariant() && rack)
      infra.variants = new Collection<Variant>(
        infra,
        domain
          .getVariant()
          .map((item) => VariantMapper.entityDomainToInfra(item)),
      );
    if (domain.getRack()) infra.rack = rack;
    if (domain.getCreatedAt()) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt()) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy()) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy()) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
