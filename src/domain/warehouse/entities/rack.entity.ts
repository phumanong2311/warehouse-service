import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';

export class DomainRackEntity extends DomainBaseEntity {
  private name!: string; // Tên của Rack
  private warehouseId!: string; // Gắn với Warehouse
  private productIds: string[];

  constructor(params: {
    id?: string;
    createdBy?: string;
    updatedBy?: string;
    name: string;
    warehouseId: string;
    productIds: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super({
      id: params.id ?? uuidv4(),
      createdBy: params.createdBy,
      updatedBy: params.updatedBy,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });

    this.name = params.name;
    this.warehouseId = params.warehouseId;
    this.productIds = params.productIds;
  }
  setName(name: string): void {
    this.name = name;
  }

  setProductIds(productIds: string[]): void {
    this.productIds = productIds;
  }

  getName(): string {
    return this.name;
  }

  getWarehouse(): string {
    return this.warehouseId;
  }

  getProductIds(): string[] {
    return this.productIds;
  }
}
