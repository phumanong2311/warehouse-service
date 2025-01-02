import { DomainProductEntity } from '@domain/product/entities/product.entity';
import { RackMapper, WarehouseMapper } from '@domain/warehouse/mapper';
import { Product as InfraProduct } from '@infra/postgresql/entities';
import { CategoryMapper } from './category.mapper';
import { VariantMapper } from './variant.mapper';

export class ProductMapper {
  static entityInfraToDomain(infra: InfraProduct): DomainProductEntity {
    return new DomainProductEntity({
      id: infra.id,
      name: infra.name,
      sku: infra.sku,
      description: infra.description,
      category: CategoryMapper.entityInfraToDomain(infra.category),
      warehouse: WarehouseMapper.entityInfraToDomain(infra.warehouse),
      variants:
        infra.variants.map((item) => VariantMapper.entityInfraToDomain(item)) ??
        [],
      rack: RackMapper.entityInfraToDomain(infra.rack),
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }

  static entityDomainToInfra(domain: DomainProductEntity): InfraProduct {
    const infra = new InfraProduct();
    infra.id = domain.getId();
    infra.name = domain.getName();
    infra.sku = domain.getSku();
    infra.description = domain.getDescription();
    infra.category = CategoryMapper.entityDomainToInfra(domain.getCategory());
    infra.warehouse = WarehouseMapper.entityDomainToInfra(
      domain.getWarehouse(),
    );
    infra.variants = domain
      .getVariant()
      .map((item) => VariantMapper.entityDomainToInfra(item));
    infra.rack = RackMapper.entityDomainToInfra(domain.getRack());
    infra.createdAt = domain.getCreatedAt();
    infra.updatedAt = domain.getUpdatedAt();
    infra.createdBy = domain.getCreatedBy();
    infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
