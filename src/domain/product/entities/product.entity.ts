import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { ProductName, SKU, ProductDescription } from '../value-objects';
import { InvalidProductDataException } from '../exceptions';

export interface ProductVariant {
  id: string;
  variantValueId: string;
  rackId?: string;
}

export class DomainProductEntity extends DomainBaseEntity {
  private readonly name: ProductName;
  private readonly sku: SKU;
  private description: ProductDescription;
  private categoryId: string;
  private warehouseId: string;
  private variants: ProductVariant[];
  private rackId?: string;

  constructor(params: {
    id?: string;
    name: string;
    sku: string;
    description?: string;
    categoryId: string;
    warehouseId: string;
    variants?: ProductVariant[];
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
    
    this.validateConstructorParams(params);
    
    this.name = new ProductName(params.name);
    this.sku = new SKU(params.sku);
    this.description = new ProductDescription(params.description);
    this.categoryId = params.categoryId;
    this.warehouseId = params.warehouseId;
    this.variants = params.variants ?? [];
    this.rackId = params.rackId;
  }

  private validateConstructorParams(params: any): void {
    if (!params.categoryId || typeof params.categoryId !== 'string') {
      throw new InvalidProductDataException('Category ID is required');
    }
    if (!params.warehouseId || typeof params.warehouseId !== 'string') {
      throw new InvalidProductDataException('Warehouse ID is required');
    }
  }
  // Business methods - more controlled than simple setters
  updateDescription(description?: string): void {
    this.description = new ProductDescription(description);
  }

  assignToRack(rackId: string): void {
    if (!rackId || typeof rackId !== 'string') {
      throw new InvalidProductDataException('Rack ID must be a valid string');
    }
    this.rackId = rackId;
  }

  removeFromRack(): void {
    this.rackId = undefined;
  }

  addVariant(variant: ProductVariant): void {
    if (!variant.id || !variant.variantValueId) {
      throw new InvalidProductDataException('Variant must have valid ID and variant value ID');
    }
    
    // Check if variant already exists
    const existingVariant = this.variants.find(v => v.id === variant.id);
    if (existingVariant) {
      throw new InvalidProductDataException(`Variant with ID ${variant.id} already exists`);
    }
    
    this.variants.push(variant);
  }

  removeVariant(variantId: string): void {
    const index = this.variants.findIndex(v => v.id === variantId);
    if (index === -1) {
      throw new InvalidProductDataException(`Variant with ID ${variantId} not found`);
    }
    this.variants.splice(index, 1);
  }

  updateVariant(variantId: string, updates: Partial<ProductVariant>): void {
    const variant = this.variants.find(v => v.id === variantId);
    if (!variant) {
      throw new InvalidProductDataException(`Variant with ID ${variantId} not found`);
    }
    
    Object.assign(variant, updates);
  }

  // Getters - read-only access
  getName(): string {
    return this.name.getValue();
  }

  getSku(): string {
    return this.sku.getValue();
  }

  getDescription(): string {
    return this.description.getValue();
  }

  hasDescription(): boolean {
    return !this.description.isEmpty();
  }

  getCategory(): string {
    return this.categoryId;
  }

  getWarehouse(): string {
    return this.warehouseId;
  }

  getVariants(): readonly ProductVariant[] {
    return [...this.variants]; // Return copy to prevent external mutation
  }

  getRack(): string | undefined {
    return this.rackId;
  }

  hasRack(): boolean {
    return !!this.rackId;
  }

  getVariantCount(): number {
    return this.variants.length;
  }

  hasVariants(): boolean {
    return this.variants.length > 0;
  }

  // Domain logic methods
  isInWarehouse(warehouseId: string): boolean {
    return this.warehouseId === warehouseId;
  }

  isInCategory(categoryId: string): boolean {
    return this.categoryId === categoryId;
  }

  canBeDeleted(): boolean {
    // Add business rules for when a product can be deleted
    // For example, products with variants might not be deletable
    return this.variants.length === 0;
  }
}
