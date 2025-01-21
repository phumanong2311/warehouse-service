import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';

export class DomainVariantTypeEntity extends DomainBaseEntity {
  private name!: string; // Ví dụ: color, size, material
  constructor(params: {
    id?: string;
    name?: string;
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
  }
  setName(name: string): void {
    this.name = name;
  }
  getName(): string {
    return this.name;
  }
}
