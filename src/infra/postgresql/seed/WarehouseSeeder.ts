import { Dictionary } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { Warehouse } from '../entities';

export class WarehouseSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager) {
    const name = `Warehouse 1`;
    const warehouse_1 = em.create(Warehouse, {
      code: `WH-${Math.random().toString(36)}`,
      phone: `+84${Math.floor(1000000000 + Math.random() * 900000000)}`,
      name,
      email: `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
      logo: `https://fakeimg.pl/300/?text=${name}`,
      address: `Address ${Math.random().toString(36)}`,
    });
    await em.persistAndFlush([warehouse_1]);
    console.log(`Seeding warehouse completed`);
  }
}
