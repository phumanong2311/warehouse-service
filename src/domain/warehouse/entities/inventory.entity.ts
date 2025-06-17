import { DomainBaseEntity } from '@share/domain/entities';
import { InventoryStatus } from '@share/types';
import { v4 as uuidv4 } from 'uuid';

export class DomainInventoryEntity extends DomainBaseEntity {
  private warehouseId: string;
  private variantId: string;
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
    variantId?: string;
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
    if (params.variantId) this.variantId = params.variantId;
    if (params.unitId) this.unitId = params.unitId;
    if (params.quantity) this.quantity = params.quantity;
    if (params.batch) this.batch = params.batch;
    if (params.expirationDate) this.expirationDate = params.expirationDate;
    if (params.status) this.status = params.status;
  }
  setWarehouse(warehouseId: string): void {
    this.warehouseId = warehouseId;
  }

  setVariant(variantId: string): void {
    this.variantId = variantId;
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

  setUnit(unitId: string): void {
    this.unitId = unitId;
  }

  getWarehouse(): string {
    return this.warehouseId;
  }

  getVariant(): string {
    return this.variantId;
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
