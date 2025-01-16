import { DomainBaseEntity } from '@share/domain/entities';
import { DomainVariantEntity } from 'src/domain/product/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainWarehouseEntity } from './warehouse.entity';

export class DomainRackEntity extends DomainBaseEntity {
  private name!: string; // Tên của Rack
  private warehouse!: DomainWarehouseEntity; // Gắn với Warehouse
  private variants: DomainVariantEntity[]; // Danh sách sản phẩm trong Rack

  constructor(params: {
    id?: string;
    createdBy?: string;
    updatedBy?: string;
    name: string;
    warehouse: DomainWarehouseEntity;
    variants?: DomainVariantEntity[];
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
    this.variants = params.variants ?? [];
  }
  setName(name: string): void {
    this.name = name;
  }

  setVariants(variants: DomainVariantEntity[]): void {
    this.variants = variants;
  }

  getName(): string {
    return this.name;
  }

  getWarehouse(): DomainWarehouseEntity {
    return this.warehouse;
  }

  getVariants(): DomainVariantEntity[] {
    return this.variants;
  }
}
