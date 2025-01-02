import { Entity, Property, Unique } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';

@Entity({ tableName: 'variant_type' })
export class VariantType extends InfraBaseEntity {
  @Property()
  @Unique()
  name!: string; // Ví dụ: color, size, material
}
