import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Variant } from './variant.entity';

@Entity({ tableName: 'size' })
export class Size extends InfraBaseEntity {
  @Property()
  name!: string; // Ví dụ: S, M, L, XL

  @ManyToOne(() => Variant, { nullable: true })
  variant?: Variant; // Nếu size thuộc về variant
}
