import { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Category } from '../entities';

export class CategorySeeder extends Seeder<Dictionary> {
  async run(em: EntityManager) {
    const category_1 = em.create(Category, {
      name: 'Iphone',
    });
    const category_2 = em.create(Category, {
      name: 'Samsung',
    });
    await em.persistAndFlush([category_1, category_2]);
    console.log('Seeding category completed !');
  }
}
