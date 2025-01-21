import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Variant } from './variant.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ tableName: 'rack' })
export class Rack extends InfraBaseEntity {
  @Property()
  name!: string;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @OneToMany(() => Variant, (variants) => variants.variantValue)
  variants: Variant[];
}
