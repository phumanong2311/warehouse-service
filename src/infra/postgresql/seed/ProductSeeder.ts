import { Dictionary } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { Category, Product, Rack, Warehouse } from '../entities';

export class ProductSeeder extends Seeder<Dictionary> {
  async run(em: EntityManager): Promise<void> {
    const category = await em.findOne(Category, { name: 'Iphone' });
    const rack = await em.findOne(Rack, { name: 'A1' });
    const warehouse = await em.findOne(Warehouse, { name: 'Warehouse 1' });

    const product_1 = em.create(Product, {
      name: 'Iphone 14',
      sku: 'IP1401-NOR-BLUE',
      category: category.id,
      rack: rack.id,
      warehouse: warehouse.id,
    });
    const product_2 = em.create(Product, {
      name: 'Iphone 14 Pro',
      sku: 'IP1402-PRO-BLUE',
      category: category.id,
      rack: rack.id,
      warehouse: warehouse.id,
    });
    await em.persistAndFlush([product_1, product_2]);
    console.log('Seeding product completed!');
  }
}
