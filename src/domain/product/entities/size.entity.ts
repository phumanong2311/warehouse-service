import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainVariantEntity } from './variant.entity';

export class DomainSizeEntity extends DomainBaseEntity {
  private name!: string; // Ví dụ: S, M, L, XL
  private variant?: DomainVariantEntity; // Nếu size thuộc về variant
  constructor(params: {
    id?: string;
    name?: string;
    variant?: DomainVariantEntity;
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
    this.variant = params.variant;
  }
  getName(): string {
    return this.name;
  }

  getVariant(): DomainVariantEntity {
    return this.variant;
  }
}
