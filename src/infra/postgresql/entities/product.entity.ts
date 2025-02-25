import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Category } from './category.entity';
import { Rack } from './rack.entity';
import { Variant } from './variant.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ tableName: 'product' })
export class Product extends InfraBaseEntity {
  @Property()
  name!: string;

  @Property()
  sku!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => Category, { fieldName: 'category_id' })
  category!: Category;

  @ManyToOne(() => Warehouse, { fieldName: 'warehouse_id' })
  warehouse!: Warehouse;

  @OneToMany(() => Variant, (variant) => variant.product)
  variants = new Collection<Variant>(this);

  @ManyToOne(() => Rack, { fieldName: 'rack_id' })
  rack!: Rack;
}
