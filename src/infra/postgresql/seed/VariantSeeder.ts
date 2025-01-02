import { Dictionary } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { Variant } from '../entities/variant.entity';
import { Product } from '../entities/product.entity';
import { VariantValue } from '../entities/variant-value.entity';

export class VariantSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager) {
    const product1 = await em.findOne(Product, { name: 'Iphone 14' });
    const product2 = await em.findOne(Product, { name: 'Iphone 14 Pro' });

    const white = await em.findOne(VariantValue, { name: 'White' });
    const black = await em.findOne(VariantValue, { name: 'Black' });
    const red = await em.findOne(VariantValue, { name: 'Red' });

    if (!product1 || !product2 || !white || !black || !red) {
      console.error(
        'Missing required entities for seeding. Please check your database.',
      );
      return;
    }

    const variants = [
      em.create(Variant, { product: product1, variantValue: white }),
      em.create(Variant, { product: product1, variantValue: black }),
      em.create(Variant, { product: product1, variantValue: red }),
      em.create(Variant, { product: product2, variantValue: white }),
      em.create(Variant, { product: product2, variantValue: black }),
    ];

    await em.persistAndFlush(variants);
    console.log('Seeding variant completed!');
  }
}
