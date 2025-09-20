import { Dictionary } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { RackSeeder } from './RackSeeder';
import { WarehouseSeeder } from './WarehouseSeeder';

export class MainSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager): Promise<void> {
    await new WarehouseSeeder().run(em);

    await new RackSeeder().run(em);
  }
}
