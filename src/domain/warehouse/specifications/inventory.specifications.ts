// Domain Specifications for Inventory Business Rules
import { DomainInventoryEntity } from '../entities';
import { InventoryStatus } from '@share/types';

export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

export class InventoryExpirationSpecification implements Specification<DomainInventoryEntity> {
  constructor(private readonly daysBeforeExpiration: number = 30) {}

  isSatisfiedBy(inventory: DomainInventoryEntity): boolean {
    if (!inventory.getExpirationDate()) {
      return true; // No expiration date means not expiring
    }
    
    const expirationDate = inventory.getExpirationDate();
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + this.daysBeforeExpiration);
    
    return expirationDate <= warningDate;
  }

  and(other: Specification<DomainInventoryEntity>): Specification<DomainInventoryEntity> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<DomainInventoryEntity>): Specification<DomainInventoryEntity> {
    return new OrSpecification(this, other);
  }

  not(): Specification<DomainInventoryEntity> {
    return new NotSpecification(this);
  }
}

export class InventoryLowStockSpecification implements Specification<DomainInventoryEntity> {
  constructor(private readonly lowStockThreshold: number = 10) {}

  isSatisfiedBy(inventory: DomainInventoryEntity): boolean {
    return inventory.getQuantity() <= this.lowStockThreshold;
  }

  and(other: Specification<DomainInventoryEntity>): Specification<DomainInventoryEntity> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<DomainInventoryEntity>): Specification<DomainInventoryEntity> {
    return new OrSpecification(this, other);
  }

  not(): Specification<DomainInventoryEntity> {
    return new NotSpecification(this);
  }
}

export class InventoryAvailableSpecification implements Specification<DomainInventoryEntity> {
  isSatisfiedBy(inventory: DomainInventoryEntity): boolean {
    return inventory.getStatus() === InventoryStatus.AVAILABLE;
  }

  and(other: Specification<DomainInventoryEntity>): Specification<DomainInventoryEntity> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<DomainInventoryEntity>): Specification<DomainInventoryEntity> {
    return new OrSpecification(this, other);
  }

  not(): Specification<DomainInventoryEntity> {
    return new NotSpecification(this);
  }
}

// Composite Specifications
class AndSpecification<T> implements Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>,
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

class OrSpecification<T> implements Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>,
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

class NotSpecification<T> implements Specification<T> {
  constructor(private specification: Specification<T>) {}

  isSatisfiedBy(candidate: T): boolean {
    return !this.specification.isSatisfiedBy(candidate);
  }

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return this.specification;
  }
}
