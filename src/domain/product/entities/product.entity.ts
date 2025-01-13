import {
  DomainRackEntity,
  DomainWarehouseEntity,
} from '@domain/warehouse/entities';
import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainCategoryEntity } from './category.entity';
import { DomainVariantEntity } from './variant.entity';

export class DomainProductEntity extends DomainBaseEntity {
  private name!: string;
  private sku!: string;
  private description?: string;
  private category!: DomainCategoryEntity;
  private warehouse!: DomainWarehouseEntity;
  private variants!: DomainVariantEntity[];
  private rack?: DomainRackEntity;

  constructor(params: {
    id?: string;
    name: string;
    sku: string;
    description?: string;
    category: DomainCategoryEntity;
    warehouse: DomainWarehouseEntity;
    variants?: DomainVariantEntity[];
    rack?: DomainRackEntity;
    createdBy?: string;
    updatedBy?: string;
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
    this.sku = params.sku;
    this.description = params.description;
    this.category = params.category;
    this.warehouse = params.warehouse;
    this.variants = params.variants ?? [];
    this.rack = params.rack;
  }
  getName(): string {
    return this.name;
  }

  getSku(): string {
    return this.sku;
  }

  getDescription(): string {
    return this.description;
  }

  getCategory(): DomainCategoryEntity {
    return this.category;
  }

  getWarehouse(): DomainWarehouseEntity {
    return this.warehouse;
  }

  getVariant(): DomainVariantEntity[] {
    return this.variants;
  }

  getRack(): DomainRackEntity {
    return this.rack;
  }
}
