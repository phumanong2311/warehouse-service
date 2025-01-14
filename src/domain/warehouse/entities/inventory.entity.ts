import { DomainBaseEntity } from '@share/domain/entities';
import { InventoryStatus } from '@share/types';
import { DomainProductEntity } from 'src/domain/product/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainWarehouseEntity } from './warehouse.entity';

export class DomainInventoryEntity extends DomainBaseEntity {
  private warehouse: DomainWarehouseEntity;
  private product: DomainProductEntity;
  private quantity!: number;
  private batch?: string; // Số lô hàng
  private expirationDate?: Date; // Ngày hết hạn
  private status: InventoryStatus;
  constructor(params: {
    id?: string;
    createdBy?: string;
    updatedBy?: string;
    warehouse?: DomainWarehouseEntity;
    product?: DomainProductEntity;
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
    this.warehouse = params.warehouse;
    this.product = params.product;
    this.quantity = params.quantity;
    this.batch = params.batch;
    this.expirationDate = params.expirationDate;
    this.status = params.status;
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

  getWarehouse(): DomainWarehouseEntity {
    return this.warehouse;
  }

  getProduct(): DomainProductEntity {
    return this.product;
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
}
