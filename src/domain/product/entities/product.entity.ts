import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainVariantEntity } from './variant.entity';

export class DomainProductEntity extends DomainBaseEntity {
  private name!: string;
  private sku!: string;
  private description?: string;
  private categoryId!: string;
  private warehouseId!: string;
  private variants!: DomainVariantEntity[];
  private rackId?: string;

  constructor(params: {
    id?: string;
    name: string;
    sku: string;
    description?: string;
    categoryId: string;
    warehouseId: string;
    variants?: DomainVariantEntity[];
    rackId?: string;
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
    if (params.description) this.description = params.description;
    this.categoryId = params.categoryId;
    this.warehouseId = params.warehouseId;
    if (params.variants) this.variants = params.variants ?? [];
    if (params.rackId) this.rackId = params.rackId;
  }
  setName(name: string): void {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setSku(sku: string): void {
    this.sku = sku;
  }

  setCategory(categoryId: string): void {
    this.categoryId = categoryId;
  }

  setWarehouse(warehouseId: string): void {
    this.warehouseId = warehouseId;
  }

  setVariants(variants: DomainVariantEntity[]): void {
    this.variants = variants;
  }

  setRack(rackId: string): void {
    this.rackId = rackId;
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

  getCategory(): string {
    return this.categoryId;
  }

  getWarehouse(): string {
    return this.warehouseId;
  }

  getVariant(): DomainVariantEntity[] {
    return this.variants;
  }

  getRack(): string {
    return this.rackId;
  }
}
