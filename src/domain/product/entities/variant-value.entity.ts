import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainVariantTypeEntity } from './variant-type.entity';

export class DomainVariantValueEntity extends DomainBaseEntity {
  private name!: string; // Ví dụ: white, blue, small, medium
  private variantType!: DomainVariantTypeEntity;
  constructor(params: {
    id?: string;
    name?: string;
    variantType?: DomainVariantTypeEntity;
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
    this.variantType = params.variantType;
  }
  setName(name: string): void {
    this.name = name;
  }
  setVariantType(variantType: DomainVariantTypeEntity): void {
    this.variantType = variantType;
  }
  getName(): string {
    return this.name;
  }
  getVariantType(): DomainVariantTypeEntity {
    return this.variantType;
  }
}
