import { Entity, ManyToOne } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Product } from './product.entity';
import { VariantValue } from './variant-value.entity';

@Entity({ tableName: 'variant' })
export class Variant extends InfraBaseEntity {
  @ManyToOne(() => Product)
  product!: Product; // Gắn với Product

  @ManyToOne(() => VariantValue)
  variantValue!: VariantValue; // Gắn với giá trị variant cụ thể (ví dụ: white, blue)
}
