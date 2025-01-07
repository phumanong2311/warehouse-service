import { DomainInventoryEntity } from '@domain/warehouse/entities';
import { InventoryMapper } from '@domain/warehouse/mapper';
import { FilterQuery } from '@mikro-orm/core';
import { Inventory } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class InventoryRepository extends BaseRepository<Inventory> {
  async findByIdWithMapper(id: string): Promise<DomainInventoryEntity> {
    const data = await this.findById(id)
    return InventoryMapper.entityInfraToDomain(data)
  };

  async findByWarehouseAndProductWithMapper(warehouseId: string, productId: string): Promise<DomainInventoryEntity> {
    // const data = await this.findOne({
    //   warehouse: warehouseId,
    //   product: productId
    // })
    const where: FilterQuery<Inventory> = {};
    if (warehouseId) {
      where.warehouse = warehouseId;
    }
    if (productId) {
      where.product = productId;
    }
    const data = await this.find(where);
    if (!data || data.length === 0) {
      return [];
    }
    return data.map(infraEntity => InventoryMapper.entityInfraToDomain(infraEntity));
  };
  findPaginationWithMapper(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }>;
  findAllWithMapper(): Promise<DomainInventoryEntity[]>;
  saveAndReturnDomain(product: DomainInventoryEntity): Promise<DomainInventoryEntity>;
  updateAndReturnDomain(
    productId: string,
    product: Partial<DomainInventoryEntity>,
  ): Promise<DomainInventoryEntity>;
  deleteProduct(productId: string): Promise<void>;
}
