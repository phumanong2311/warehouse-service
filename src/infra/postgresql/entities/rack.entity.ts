import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Variant } from './variant.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ tableName: 'rack' })
export class Rack extends InfraBaseEntity {
  @Property()
  name!: string;

  @ManyToOne(() => Warehouse, { nullable: false, eager: false })
  warehouse!: Warehouse;

  @OneToMany(() => Variant, (variants) => variants.rack)
  variants = new Collection<Variant>(this);
}
