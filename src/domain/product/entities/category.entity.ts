import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';

export class DomainCategoryEntity extends DomainBaseEntity {
  private name: string;
  private description?: string;
  constructor(params: {
    id?: string;
    name?: string;
    description?: string;
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
    this.description = params.description;
  }
  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }
}
