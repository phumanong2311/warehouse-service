import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { VariantType } from './variant-type.entity';

@Entity({ tableName: 'variant_value' })
export class VariantValue extends InfraBaseEntity {
  @Property()
  @Unique()
  name!: string; // Ví dụ: white, blue, small, medium

  @ManyToOne(() => VariantType)
  variantType!: VariantType;
}
