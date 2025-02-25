import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { InventoryStatus } from '@share/types';
import { Unit } from './unit.entity';
import { Variant } from './variant.entity';
import { Warehouse } from './warehouse.entity';
import { Rack } from './rack.entity';

@Entity({ tableName: 'inventory' })
export class Inventory extends InfraBaseEntity {
  @ManyToOne(() => Warehouse, { fieldName: 'warehouse_id' })
  warehouse!: Warehouse;

  @ManyToOne(() => Variant)
  variant!: Variant;

  @ManyToOne(() => Unit)
  unit?: Unit;

  @Property()
  quantity!: number;

  @Property({ nullable: true })
  batch?: string; // Số lô hàng

  @Property({ nullable: true })
  expirationDate?: Date;

  @Property({
    default: InventoryStatus.AVAILABLE,
  })
  status: InventoryStatus = InventoryStatus.AVAILABLE;
}
