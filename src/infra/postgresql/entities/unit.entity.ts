import { Entity, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { v4 as uuidv4 } from 'uuid';

@Entity({ tableName: 'unit' })
export class Unit extends InfraBaseEntity {
  @Property({ type: 'string' })
  name!: string; // Ví dụ: piece, kg, gram, etc.

  @Property({ type: 'string', nullable: true })
  symbol?: string; // Ví dụ: 'kg', 'pcs', 'g'

  constructor(params: { name: string; symbol?: string }) {
    super();
    this.name = params.name;
    this.symbol = params.symbol;
  }

  getName(): string {
    return this.name;
  }

  getSymbol(): string | undefined {
    return this.symbol;
  }
}
