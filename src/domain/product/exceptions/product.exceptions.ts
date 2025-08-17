export abstract class ProductDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ProductNotFoundException extends ProductDomainException {
  constructor(productId: string) {
    super(`Product with ID ${productId} not found`);
  }
}

export class InvalidProductDataException extends ProductDomainException {
  constructor(message: string) {
    super(`Invalid product data: ${message}`);
  }
}

export class ProductAlreadyExistsException extends ProductDomainException {
  constructor(sku: string) {
    super(`Product with SKU ${sku} already exists`);
  }
}

export class ProductCannotBeUpdatedException extends ProductDomainException {
  constructor(reason: string) {
    super(`Product cannot be updated: ${reason}`);
  }
}

export class ProductCannotBeDeletedException extends ProductDomainException {
  constructor(reason: string) {
    super(`Product cannot be deleted: ${reason}`);
  }
}
