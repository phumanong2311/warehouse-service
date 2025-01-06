import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ tableName: 'rack' })
export class Rack extends InfraBaseEntity {
  @Property()
  name!: string;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @OneToMany(() => Product, (product) => product.rack)
  products: Product[];
}