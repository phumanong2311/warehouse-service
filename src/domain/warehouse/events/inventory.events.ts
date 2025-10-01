// Domain Events for Inventory Operations
export interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  occurredOn: Date;
  version: number;
}

export class InventoryCheckedInEvent implements DomainEvent {
  eventId: string;
  eventType = 'InventoryCheckedIn';
  aggregateId: string;
  occurredOn: Date;
  version: number;

  constructor(
    public warehouseId: string,
    public productId: string,
    public unitId: string,
    public quantity: number,
    public batch: string,
    public expirationDate: Date,
  ) {
    this.eventId = `inventory-checked-in-${Date.now()}`;
    this.aggregateId = `${warehouseId}-${productId}`;
    this.occurredOn = new Date();
    this.version = 1;
  }
}

export class InventoryCheckedOutEvent implements DomainEvent {
  eventId: string;
  eventType = 'InventoryCheckedOut';
  aggregateId: string;
  occurredOn: Date;
  version: number;

  constructor(
    public warehouseId: string,
    public productId: string,
    public unitId: string,
    public quantity: number,
    public batch: string,
  ) {
    this.eventId = `inventory-checked-out-${Date.now()}`;
    this.aggregateId = `${warehouseId}-${productId}`;
    this.occurredOn = new Date();
    this.version = 1;
  }
}

export class InventoryTransferredEvent implements DomainEvent {
  eventId: string;
  eventType = 'InventoryTransferred';
  aggregateId: string;
  occurredOn: Date;
  version: number;

  constructor(
    public fromWarehouseId: string,
    public toWarehouseId: string,
    public productId: string,
    public unitId: string,
    public quantity: number,
    public batch: string,
  ) {
    this.eventId = `inventory-transferred-${Date.now()}`;
    this.aggregateId = `${fromWarehouseId}-${productId}`;
    this.occurredOn = new Date();
    this.version = 1;
  }
}
