export interface ProductSpecification {
  isSatisfiedBy(product: any): boolean;
  toFilterQuery(): Record<string, any>;
}

export class ProductInWarehouseSpecification implements ProductSpecification {
  constructor(private readonly warehouseId: string) {}

  isSatisfiedBy(product: any): boolean {
    return product.warehouseId === this.warehouseId || product.warehouse?.id === this.warehouseId;
  }

  toFilterQuery(): Record<string, any> {
    return { warehouse: this.warehouseId };
  }
}

export class ProductInCategorySpecification implements ProductSpecification {
  constructor(private readonly categoryId: string) {}

  isSatisfiedBy(product: any): boolean {
    return product.categoryId === this.categoryId || product.category?.id === this.categoryId;
  }

  toFilterQuery(): Record<string, any> {
    return { category: this.categoryId };
  }
}

export class ProductInRackSpecification implements ProductSpecification {
  constructor(private readonly rackId: string) {}

  isSatisfiedBy(product: any): boolean {
    return product.rackId === this.rackId || product.rack?.id === this.rackId;
  }

  toFilterQuery(): Record<string, any> {
    return { rack: this.rackId };
  }
}

export class ProductBySkuSpecification implements ProductSpecification {
  constructor(private readonly sku: string) {}

  isSatisfiedBy(product: any): boolean {
    const productSku = product.sku || product.getSku?.();
    return productSku?.toLowerCase().includes(this.sku.toLowerCase());
  }

  toFilterQuery(): Record<string, any> {
    return { sku: { $like: `%${this.sku}%` } };
  }
}

export class ProductByNameSpecification implements ProductSpecification {
  constructor(private readonly name: string) {}

  isSatisfiedBy(product: any): boolean {
    const productName = product.name || product.getName?.();
    return productName?.toLowerCase().includes(this.name.toLowerCase());
  }

  toFilterQuery(): Record<string, any> {
    return { name: { $like: `%${this.name}%` } };
  }
}

export class ProductWithVariantsSpecification implements ProductSpecification {
  constructor(private readonly hasVariants: boolean = true) {}

  isSatisfiedBy(product: any): boolean {
    const variants = product.variants || product.getVariants?.() || [];
    return this.hasVariants ? variants.length > 0 : variants.length === 0;
  }

  toFilterQuery(): Record<string, any> {
    // This would need to be handled at the repository level with joins
    return {};
  }
}

export class CompositeProductSpecification implements ProductSpecification {
  private specifications: ProductSpecification[] = [];

  and(spec: ProductSpecification): CompositeProductSpecification {
    this.specifications.push(spec);
    return this;
  }

  isSatisfiedBy(product: any): boolean {
    return this.specifications.every(spec => spec.isSatisfiedBy(product));
  }

  toFilterQuery(): Record<string, any> {
    return this.specifications.reduce((query, spec) => {
      return { ...query, ...spec.toFilterQuery() };
    }, {});
  }
}

// Factory for creating common specifications
export class ProductSpecificationFactory {
  static inWarehouse(warehouseId: string): ProductInWarehouseSpecification {
    return new ProductInWarehouseSpecification(warehouseId);
  }

  static inCategory(categoryId: string): ProductInCategorySpecification {
    return new ProductInCategorySpecification(categoryId);
  }

  static inRack(rackId: string): ProductInRackSpecification {
    return new ProductInRackSpecification(rackId);
  }

  static bySku(sku: string): ProductBySkuSpecification {
    return new ProductBySkuSpecification(sku);
  }

  static byName(name: string): ProductByNameSpecification {
    return new ProductByNameSpecification(name);
  }

  static withVariants(): ProductWithVariantsSpecification {
    return new ProductWithVariantsSpecification(true);
  }

  static withoutVariants(): ProductWithVariantsSpecification {
    return new ProductWithVariantsSpecification(false);
  }

  static composite(): CompositeProductSpecification {
    return new CompositeProductSpecification();
  }
}
