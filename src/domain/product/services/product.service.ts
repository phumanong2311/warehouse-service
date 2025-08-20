import { DomainProductEntity } from '../entities';

export class ProductDomainService {
  // Pure domain logic without any infrastructure dependencies
  validateProduct(product: DomainProductEntity): boolean {
    if (!product.getName() || product.getName().trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (product.getPrice() <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    return true;
  }

  calculateDiscount(product: DomainProductEntity, discountPercentage: number): number {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }

    return product.getPrice() * (1 - discountPercentage / 100);
  }

  isProductAvailable(product: DomainProductEntity): boolean {
    return product.getStockQuantity() > 0;
  }
}
