import { Dictionary } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { VariantType } from '../entities/variant-type.entity';
import { VariantValue } from '../entities/variant-value.entity';

export class VariantValueSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager) {
    const color = await em.findOne(VariantType, { name: 'Color' });
    const size = await em.findOne(VariantType, { name: 'Size' });

    const black = await em.create(VariantValue, {
      name: 'Black',
      variantType: color,
    });
    const white = await em.create(VariantValue, {
      name: 'White',
      variantType: color,
    });
    const red = await em.create(VariantValue, {
      name: 'Red',
      variantType: color,
    });

    const small = await em.create(VariantValue, {
      name: 'Small',
      variantType: size,
    });
    const medium = await em.create(VariantValue, {
      name: 'Medium',
      variantType: size,
    });
    const large = await em.create(VariantValue, {
      name: 'Large',
      variantType: size,
    });

    await em.persistAndFlush([black, white, red, small, medium, large]);
    console.log('Seeding variant value completed!');
  }
}
