import { Dictionary } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { CategorySeeder } from './CategorySeeder';
import { ProductSeeder } from './ProductSeeder';
import { RackSeeder } from './RackSeeder';
import { VariantSeeder } from './VariantSeeder';
import { VariantTypeSeeder } from './VariantTypeSeeder';
import { VariantValueSeeder } from './VariantValueSeeder copy';
import { WarehouseSeeder } from './WarehouseSeeder';

export class MainSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager): Promise<void> {
    await new WarehouseSeeder().run(em);

    await new RackSeeder().run(em);

    await new CategorySeeder().run(em);

    await new VariantTypeSeeder().run(em);

    await new VariantValueSeeder().run(em);

    await new ProductSeeder().run(em);

    await new VariantSeeder().run(em);
  }
}
