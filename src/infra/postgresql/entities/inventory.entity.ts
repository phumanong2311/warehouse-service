import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ tableName: 'inventory' })
export class Inventory extends InfraBaseEntity {
  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @ManyToOne(() => Product)
  product!: Product;

  @Property()
  quantity!: number;

  @Property({ nullable: true })
  batch?: string; // Số lô hàng

  @Property({ nullable: true })
  expirationDate?: Date;
}
