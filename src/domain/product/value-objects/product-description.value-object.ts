export class ProductDescription {
  private readonly value: string;

  constructor(description?: string) {
    if (description) {
      this.validate(description);
      this.value = description.trim();
    } else {
      this.value = '';
    }
  }

  private validate(description: string): void {
    if (typeof description !== 'string') {
      throw new Error('Product description must be a string');
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 1000) {
      throw new Error('Product description cannot exceed 1000 characters');
    }
  }

  getValue(): string {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  equals(other: ProductDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
