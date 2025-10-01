import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';

export class DomainRackEntity extends DomainBaseEntity {
  private name!: string; // Tên của Rack
  private warehouseId!: string; // Gắn với Warehouse

  constructor(params: {
    id?: string;
    createdBy?: string;
    updatedBy?: string;
    name: string;
    warehouseId: string;
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
  }
  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  getWarehouse(): string {
    return this.warehouseId;
  }
}
