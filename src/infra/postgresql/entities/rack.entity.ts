import {
  Entity,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Warehouse } from './warehouse.entity';

@Entity({ tableName: 'rack' })
export class Rack extends InfraBaseEntity {
  @Property()
  name!: string;

  @ManyToOne(() => Warehouse, { nullable: false, eager: false })
  warehouse!: Warehouse;

  @Property({ type: 'json', nullable: true })
  variantIds?: string[]; // Store variant IDs as JSON array
}
