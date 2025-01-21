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

  static entityDomainToInfra(
    domain: Partial<DomainProductEntity>,
  ): InfraProduct {
    const infra = new InfraProduct();
    if (domain.getId) infra.id = domain.getId();
    if (domain.getName) infra.name = domain.getName();
    if (domain.getSku) infra.sku = domain.getSku();
    if (domain.getDescription) infra.description = domain.getDescription();
    if (domain.getCategory)
      infra.category = CategoryMapper.entityDomainToInfra(domain.getCategory());
    if (domain.getWarehouse)
      infra.warehouse = WarehouseMapper.entityDomainToInfra(
        domain.getWarehouse(),
      );
    if (domain.getVariant)
      infra.variants = domain
        .getVariant()
        .map((item) => VariantMapper.entityDomainToInfra(item));
    if (domain.getRack)
      infra.rack = RackMapper.entityDomainToInfra(domain.getRack());
    if (domain.getCreatedAt) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
