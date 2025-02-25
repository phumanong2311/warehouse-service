import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainProductEntity } from './product.entity';

export class DomainVariantEntity extends DomainBaseEntity {
  private product!: DomainProductEntity; // Gắn với Product
  private variantValueId!: string; // Gắn với giá trị variant cụ thể (ví dụ: white, blue)
  private rackId: string;
  constructor(params: {
    id?: string;
    product?: DomainProductEntity;
    variantValueId?: string;
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
    if (params.product) this.product = params.product;
    if (params.variantValueId) this.variantValueId = params.variantValueId;
    if (params.rackId) this.rackId = params.rackId;
  }
  setProduct(product: DomainProductEntity): void {
    this.product = product;
  }
  setVariantValue(variantValueId: string): void {
    this.variantValueId = variantValueId;
  }
  setRack(rackId: string): void {
    this.rackId = rackId;
  }
  getProduct(): DomainProductEntity {
    return this.product;
  }
  getVariantValue(): string {
    return this.variantValueId;
  }
  getRack(): string {
    return this.rackId;
  }
}
