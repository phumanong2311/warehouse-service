// src/domain/warehouse/entities/warehouse.entity.ts
import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Rack } from './rack.entity';

@Entity({ tableName: 'warehouse' })
export class Warehouse extends InfraBaseEntity {
  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string', unique: true })
  code!: string;

  @Property({ type: 'string' })
  phone!: string;

  @Property({ type: 'string' })
  email!: string;

  @Property({ type: 'string' })
  logo!: string;

  @Property({ type: 'string' })
  address!: string;

  @OneToMany(() => Rack, (rack) => rack.warehouse, {
    nullable: true,
    eager: false,
  })
  racks = new Collection<Rack>(this);

  @Property({ type: Date })
  registrationExpirationDate!: Date;
}
