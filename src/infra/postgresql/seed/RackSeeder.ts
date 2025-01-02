import { Dictionary } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { Rack, Warehouse } from '../entities';

export class RackSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager) {
    const warehouse = await em.findOne(Warehouse, { name: 'Warehouse 1' });
    const rack = em.create(Rack, {
      name: 'A1',
      warehouse: warehouse.id,
    });
    await em.persistAndFlush([rack]);
    console.log(`Seeding rack completed`);
  }
}
