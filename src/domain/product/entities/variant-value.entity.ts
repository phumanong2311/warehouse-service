import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainVariantTypeEntity } from './variant-type.entity';

export class DomainVariantValueEntity extends DomainBaseEntity {
  private name!: string; // Ví dụ: white, blue, small, medium
  private variantTypeId!: string;
  constructor(params: {
    id?: string;
    name?: string;
    variantTypeId?: string;
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
    if (params.name) this.name = params.name;
    if (params.variantTypeId) this.variantTypeId = params.variantTypeId;
  }
  setName(name: string): void {
    this.name = name;
  }
  setVariantType(variantTypeId: string): void {
    this.variantTypeId = variantTypeId;
  }
  getName(): string {
    return this.name;
  }
  getVariantType(): string {
    return this.variantTypeId;
  }
}
