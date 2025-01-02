import { Dictionary } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { VariantType } from '../entities/variant-type.entity';

export class VariantTypeSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager) {
    const color = await em.create(VariantType, { name: 'Color' });
    const size = await em.create(VariantType, { name: 'Size' });
    await em.persistAndFlush([color, size]);
    console.log('Seeding variant type completed!');
  }
}
