export class ProductName {
  private readonly value: string;

  constructor(name: string) {
    this.validate(name);
    this.value = name.trim();
  }

  private validate(name: string): void {
    if (!name || typeof name !== 'string') {
      throw new Error('Product name is required');
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Product name cannot be empty');
    }

    if (trimmedName.length < 2) {
      throw new Error('Product name must be at least 2 characters long');
    }

    if (trimmedName.length > 100) {
      throw new Error('Product name cannot exceed 100 characters');
    }

    // Check for invalid characters (only allow letters, numbers, spaces, and common punctuation)
    const validPattern = /^[a-zA-Z0-9\s\-_.,()&]+$/;
    if (!validPattern.test(trimmedName)) {
      throw new Error('Product name contains invalid characters');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
