import { Entity, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';

@Entity({ tableName: 'unit' })
export class Unit extends InfraBaseEntity {
  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string' })
  symbol!: string;

  @Property({ type: 'string', nullable: true })
  description?: string;

  @Property({ type: 'number', nullable: true })
  conversionRate?: number;
}
