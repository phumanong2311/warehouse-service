import { DomainBaseEntity } from '@share/domain/entities';
import { InventoryStatus } from '@share/types';
import { v4 as uuidv4 } from 'uuid';

export class DomainInventoryEntity extends DomainBaseEntity {
  private warehouseId: string;
  private rackId: string;
  private productId: string;
  private unitId: string;
  private quantity!: number;
  private batch?: string; // Số lô hàng
  private expirationDate?: Date; // Ngày hết hạn
  private status: InventoryStatus;
  constructor(params: {
    id?: string;
    createdBy?: string;
    updatedBy?: string;
    warehouseId?: string;
    rackId?: string;
    productId?: string;
    unitId?: string;
    quantity?: number;
    batch?: string;
    expirationDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    status?: InventoryStatus;
  }) {
    super({
      id: params.id ?? uuidv4(),
      createdBy: params.createdBy,
      updatedBy: params.updatedBy,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    if (params.warehouseId) this.warehouseId = params.warehouseId;
    if (params.rackId) this.rackId = params.rackId;
    if (params.productId) this.productId = params.productId;
    if (params.unitId) this.unitId = params.unitId;
    if (params.quantity) this.quantity = params.quantity;
    if (params.batch) this.batch = params.batch;
    if (params.expirationDate) this.expirationDate = params.expirationDate;
    if (params.status) this.status = params.status;
  }
  setWarehouse(warehouseId: string): void {
    this.warehouseId = warehouseId;
  }

  setQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
  }

  setStatus(newStatus: InventoryStatus): void {
    this.status = newStatus;
  }

  setBatch(newBatch: string): void {
    this.batch = newBatch;
  }

  setExpirationDate(newDate: Date): void {
    this.expirationDate = newDate;
  }

  setRack(rackId: string): void {
    this.rackId = rackId;
  }

  setProduct(productId: string): void {
    this.productId = productId;
  }

  setUnit(unitId: string): void {
    this.unitId = unitId;
  }

  getWarehouse(): string {
    return this.warehouseId;
  }

  getRack(): string {
    return this.rackId;
  }

  getProduct(): string {
    return this.productId;
  }

  getUnit(): string {
    return this.unitId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getBatch(): string {
    return this.batch;
  }

  getExpirationDate(): Date {
    return this.expirationDate;
  }

  getStatus(): InventoryStatus {
    return this.status;
  }
}
