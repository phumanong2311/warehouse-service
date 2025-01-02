import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainProductEntity } from './product.entity';
import { DomainVariantValueEntity } from './variant-value.entity';

export class DomainVariantEntity extends DomainBaseEntity {
  private product!: DomainProductEntity; // Gắn với Product
  private variantValue!: DomainVariantValueEntity; // Gắn với giá trị variant cụ thể (ví dụ: white, blue)
  constructor(params: {
    id?: string;
    product?: DomainProductEntity;
    variantValue?: DomainVariantValueEntity;
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
    this.product = params.product;
    this.variantValue = params.variantValue;
  }
  getProduct(): DomainProductEntity {
    return this.product;
  }

  getVariantValue(): DomainVariantValueEntity {
    return this.variantValue;
  }
}
