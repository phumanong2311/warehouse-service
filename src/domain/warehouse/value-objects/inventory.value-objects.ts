// Domain Value Objects for Inventory
export class Quantity {
  private constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    if (this.value < other.value) {
      throw new Error('Insufficient quantity');
    }
    return new Quantity(this.value - other.value);
  }

  isZero(): boolean {
    return this.value === 0;
  }

  isPositive(): boolean {
    return this.value > 0;
  }
}

export class BatchNumber {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Batch number cannot be empty');
    }
  }

  static create(value: string): BatchNumber {
    return new BatchNumber(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BatchNumber): boolean {
    return this.value === other.value;
  }
}

export class ExpirationDate {
  private constructor(private readonly value: Date) {
    if (value < new Date()) {
      throw new Error('Expiration date cannot be in the past');
    }
  }

  static create(value: Date): ExpirationDate {
    return new ExpirationDate(value);
  }

  static createFromString(dateString: string): ExpirationDate {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    return new ExpirationDate(date);
  }

  getValue(): Date {
    return this.value;
  }

  isExpired(): boolean {
    return this.value < new Date();
  }

  isExpiringWithin(days: number): boolean {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return this.value <= futureDate;
  }
}

export class InventoryLocation {
  private constructor(
    private readonly warehouseId: string,
    private readonly productId: string,
    private readonly unitId: string,
  ) {
    if (!warehouseId || !productId || !unitId) {
      throw new Error('All location components are required');
    }
  }

  static create(warehouseId: string, productId: string, unitId: string): InventoryLocation {
    return new InventoryLocation(warehouseId, productId, unitId);
  }

  getWarehouseId(): string {
    return this.warehouseId;
  }

  getVariantId(): string {
    return this.productId;
  }

  getUnitId(): string {
    return this.unitId;
  }

  equals(other: InventoryLocation): boolean {
    return (
      this.warehouseId === other.warehouseId &&
      this.productId === other.productId &&
      this.unitId === other.unitId
    );
  }
}
