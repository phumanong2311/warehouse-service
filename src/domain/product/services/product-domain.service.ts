import { Injectable } from '@nestjs/common';
import { DomainProductEntity } from '../entities/product.entity';
import { SKU } from '../value-objects';
import { ProductAlreadyExistsException, ProductCannotBeUpdatedException, ProductCannotBeDeletedException } from '../exceptions';

@Injectable()
export class ProductDomainService {
  /**
   * Validates that a product can be created with the given SKU
   * This would typically check against a repository for uniqueness
   */
  async validateProductCreation(
    sku: SKU,
    checkSkuUniqueness: (sku: string) => Promise<boolean>
  ): Promise<void> {
    const isSkuUnique = await checkSkuUniqueness(sku.getValue());
    if (!isSkuUnique) {
      throw new ProductAlreadyExistsException(sku.getValue());
    }
  }

  /**
   * Validates that a product can be updated
   */
  validateProductUpdate(
    product: DomainProductEntity,
    updates: Partial<{
      warehouseId: string;
      rackId: string;
      categoryId: string;
      description: string;
    }>
  ): void {
    // Business rule: Cannot change warehouse if product has variants
    if (updates.warehouseId && product.hasVariants()) {
      throw new ProductCannotBeUpdatedException(
        'Cannot change warehouse for products with variants'
      );
    }

    // Business rule: Cannot change rack if product has variants in different racks
    if (updates.rackId && product.hasVariants()) {
      const variants = product.getVariants();
      const hasVariantsInDifferentRacks = variants.some(
        v => v.rackId && v.rackId !== updates.rackId
      );
      
      if (hasVariantsInDifferentRacks) {
        throw new ProductCannotBeUpdatedException(
          'Cannot change rack when variants exist in different racks'
        );
      }
    }
  }

  /**
   * Validates that a product can be deleted
   */
  validateProductDeletion(
    product: DomainProductEntity,
    checkDependencies?: (productId: string) => Promise<boolean>
  ): void {
    // Business rule: Cannot delete products with variants
    if (!product.canBeDeleted()) {
      throw new ProductCannotBeDeletedException(
        'Cannot delete product with existing variants'
      );
    }

    // Additional business rules can be added here
    // For example, checking if product is referenced in orders, etc.
  }

  /**
   * Business logic for transferring a product to a different warehouse
   */
  async transferProductToWarehouse(
    product: DomainProductEntity,
    targetWarehouseId: string,
    validateWarehouseExists: (warehouseId: string) => Promise<boolean>
  ): Promise<void> {
    // Validate target warehouse exists
    const warehouseExists = await validateWarehouseExists(targetWarehouseId);
    if (!warehouseExists) {
      throw new ProductCannotBeUpdatedException(
        `Target warehouse ${targetWarehouseId} does not exist`
      );
    }

    // Apply business rules
    this.validateProductUpdate(product, { warehouseId: targetWarehouseId });

    // If product is assigned to a rack, remove it during warehouse transfer
    if (product.hasRack()) {
      product.removeFromRack();
    }
  }

  /**
   * Business logic for organizing products by category
   */
  canProductsBeGrouped(products: DomainProductEntity[]): boolean {
    if (products.length === 0) return false;

    // Check if all products are in the same warehouse
    const firstWarehouse = products[0].getWarehouse();
    return products.every(p => p.isInWarehouse(firstWarehouse));
  }

  /**
   * Calculate total variants across multiple products
   */
  calculateTotalVariants(products: DomainProductEntity[]): number {
    return products.reduce((total, product) => total + product.getVariantCount(), 0);
  }

  /**
   * Find products that can be moved to a specific rack
   */
  filterProductsForRackAssignment(
    products: DomainProductEntity[],
    targetWarehouseId: string
  ): DomainProductEntity[] {
    return products.filter(product => {
      // Only products in the same warehouse can be assigned to the rack
      if (!product.isInWarehouse(targetWarehouseId)) {
        return false;
      }

      // Products with variants in different racks cannot be moved
      const variants = product.getVariants();
      if (variants.length > 0) {
        const uniqueRacks = new Set(variants.map(v => v.rackId).filter(Boolean));
        return uniqueRacks.size <= 1; // 0 or 1 unique rack
      }

      return true;
    });
  }
}
