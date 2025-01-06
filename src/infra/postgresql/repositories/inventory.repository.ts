import { DomainInventoryEntity } from '@domain/warehouse/entities';
import { InventoryMapper } from '@domain/warehouse/mapper';
import { Inventory } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class InventoryRepository extends BaseRepository<Inventory> {
  async findInventoryByIdWithMapper(warehouseId: string, productId: string): Promise<DomainInventoryEntity> {
    const data = await this.findOne({
      warehouse: warehouseId,
      product: productId
    })
    return InventoryMapper.entityInfraToDomain(data)
  }
}
