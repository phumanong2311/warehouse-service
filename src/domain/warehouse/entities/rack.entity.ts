import { DomainBaseEntity } from '@share/domain/entities';
import { DomainProductEntity } from 'src/domain/product/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainWarehouseEntity } from './warehouse.entity';

export class DomainRackEntity extends DomainBaseEntity {
  private name!: string; // Tên của Rack
  private warehouse!: DomainWarehouseEntity; // Gắn với Warehouse
  private products: DomainProductEntity[]; // Danh sách sản phẩm trong Rack

  constructor(params: {
    id?: string;
    createdBy?: string;
    updatedBy?: string;
    name: string;
    warehouse: DomainWarehouseEntity;
    products?: DomainProductEntity[];
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
    this.warehouse = params.warehouse;
    this.products = params.products ?? [];
  }
  getName(): string {
    return this.name;
  }

  getWarehouse(): DomainWarehouseEntity {
    return this.warehouse;
  }

  getProducts(): DomainProductEntity[] {
    return this.products;
  }
}
