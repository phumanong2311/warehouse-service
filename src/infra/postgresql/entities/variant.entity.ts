import { Entity, ManyToOne } from '@mikro-orm/core';
import { InfraBaseEntity } from '@share/infra/entities';
import { Product } from './product.entity';
import { Rack } from './rack.entity';
import { VariantValue } from './variant-value.entity';

@Entity({ tableName: 'variant' })
export class Variant extends InfraBaseEntity {
  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => VariantValue)
  variantValue!: VariantValue; // Gắn với giá trị variant cụ thể (ví dụ: white, blue)

  @ManyToOne(() => Rack, { nullable: true })
  rack?: Rack;
}
