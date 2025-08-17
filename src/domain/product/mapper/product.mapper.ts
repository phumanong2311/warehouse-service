import { DomainProductEntity, ProductVariant } from '@domain/product/entities/product.entity';
import {
  Category,
  Product as InfraProduct,
  Rack,
  Variant,
  Warehouse,
} from '@infra/postgresql/entities';
import { Collection } from '@mikro-orm/core';

export class ProductMapper {
  static entityInfraToDomain(infra: InfraProduct): DomainProductEntity {
    // Convert infrastructure variants to domain variants
    const variants: ProductVariant[] = infra.variants.isInitialized()
      ? infra.variants.getItems().map((variant) => ({
          id: variant.id,
          variantValueId: variant.variantValue?.id || '',
          rackId: variant.rack?.id,
        }))
      : [];

    return new DomainProductEntity({
      id: infra.id,
      name: infra.name,
      sku: infra.sku,
      description: infra.description || undefined,
      categoryId: infra.category?.id || '',
      warehouseId: infra.warehouse?.id || '',
      variants,
      rackId: infra.rack?.id,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }

  static entityDomainToInfra(
    domain: DomainProductEntity,
    category?: Category,
    warehouse?: Warehouse,
    rack?: Rack,
  ): InfraProduct {
    const infra = new InfraProduct();
    
    // Map basic properties
    infra.id = domain.getId();
    infra.name = domain.getName();
    infra.sku = domain.getSku();
    infra.description = domain.hasDescription() ? domain.getDescription() : null;
    
    // Map relationships
    if (category) {
      infra.category = category;
    }
    if (warehouse) {
      infra.warehouse = warehouse;
    }
    if (rack) {
      infra.rack = rack;
    }

    // Map variants - this would need to be handled at the repository level
    // since we need to create/update actual Variant entities
    infra.variants = new Collection<Variant>(infra);

    // Map audit fields
    infra.createdAt = domain.getCreatedAt();
    infra.updatedAt = domain.getUpdatedAt();
    infra.createdBy = domain.getCreatedBy();
    infra.updatedBy = domain.getUpdatedBy();

    return infra;
  }

  static partialDomainToInfra(
    domain: Partial<DomainProductEntity>,
    existing: InfraProduct,
  ): InfraProduct {
    // Update only the fields that are present in the partial domain entity
    if (domain.hasDescription?.()) {
      existing.description = domain.getDescription?.() || null;
    }

    // Update audit fields
    if (domain.getUpdatedAt?.()) {
      existing.updatedAt = domain.getUpdatedAt();
    }
    if (domain.getUpdatedBy?.()) {
      existing.updatedBy = domain.getUpdatedBy();
    }

    return existing;
  }

  /**
   * Maps domain variants to infrastructure variants
   * This should be used when creating/updating variants
   */
  static domainVariantsToInfraVariants(
    domainVariants: readonly ProductVariant[],
    product: InfraProduct,
  ): Variant[] {
    // This would need proper implementation based on your Variant entity structure
    // For now, returning empty array as we simplified the variant handling
    return [];
  }
}
