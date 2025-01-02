import { Product } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class ProductRepository extends BaseRepository<Product> {
  async getProductsInWarehouse(warehouseId: string): Promise<Product[]> {
    return await this.find({ warehouse: warehouseId });
  }
}
