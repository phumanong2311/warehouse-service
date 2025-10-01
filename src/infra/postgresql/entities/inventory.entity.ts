import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { InventoryStatus } from '@share/types';
import { Unit } from './unit.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ tableName: 'inventory' })
export class Inventory extends InfraBaseEntity {
  @ManyToOne(() => Warehouse, { fieldName: 'warehouse_id' })
  warehouse!: Warehouse;

  @Property()
  rackId!: string; // Store rack ID as string

  @Property()
  productId!: string; // Store product ID as string

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
