export class SKU {
  private readonly value: string;

  constructor(sku: string) {
    this.validate(sku);
    this.value = sku.toUpperCase().trim();
  }

  private validate(sku: string): void {
    if (!sku || typeof sku !== 'string') {
      throw new Error('SKU is required');
    }

    const trimmedSku = sku.trim();
    if (trimmedSku.length === 0) {
      throw new Error('SKU cannot be empty');
    }

    if (trimmedSku.length < 3) {
      throw new Error('SKU must be at least 3 characters long');
    }

    if (trimmedSku.length > 50) {
      throw new Error('SKU cannot exceed 50 characters');
    }

    // SKU should only contain alphanumeric characters and hyphens
    const validPattern = /^[A-Za-z0-9\-]+$/;
    if (!validPattern.test(trimmedSku)) {
      throw new Error('SKU can only contain letters, numbers, and hyphens');
    }

    // SKU should not start or end with hyphen
    if (trimmedSku.startsWith('-') || trimmedSku.endsWith('-')) {
      throw new Error('SKU cannot start or end with hyphen');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SKU): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
