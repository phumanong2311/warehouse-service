import { DomainInventoryEntity } from '@domain/warehouse/entities';
import { InventoryMapper } from '@domain/warehouse/mapper';
import { FilterQuery } from '@mikro-orm/core';
import { Inventory } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class InventoryRepository extends BaseRepository<Inventory> {
  async findByIdWithMapper(id: string): Promise<DomainInventoryEntity> {
    const data = await this.findById(id);
    return InventoryMapper.entityInfraToDomain(data);
  }

  async findInventoryWithQuery(
    warehouseId?: string,
    productId?: string,
    expirationDate?: Date,
    batch?: string,
  ): Promise<DomainInventoryEntity> {
    const where: FilterQuery<Inventory> = {};
    if (warehouseId) {
      where.warehouse = warehouseId;
    }
    if (productId) {
      where.product = productId;
    }
    if (expirationDate) {
      where.expirationDate = expirationDate;
    }
    if (batch) {
      where.batch = batch;
    }
    const data = await this.findOne(where);
    return InventoryMapper.entityInfraToDomain(data);
  }

  async findPaginationWithMapper(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }> {
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map((item) =>
      InventoryMapper.entityInfraToDomain(item),
    );
    return {
      data: mappedData,
      total,
    };
  }

  async findAllWithMapper(): Promise<DomainInventoryEntity[]> {
    const data = await this.findAll();
    return data.map((item) => InventoryMapper.entityInfraToDomain(item));
  }

  async saveAndReturnDomain(
    inventory: DomainInventoryEntity,
  ): Promise<DomainInventoryEntity> {
    const entity = InventoryMapper.entityDomainToInfra(inventory);
    const savedEntity = await this.save(entity);
    return InventoryMapper.entityInfraToDomain(savedEntity);
  }

  async updateAndReturnDomain(
    id: string,
    inventory: DomainInventoryEntity,
  ): Promise<DomainInventoryEntity> {
    const entity = InventoryMapper.entityDomainToInfra(inventory);
    const updatedEntity = await this.update(id, entity);
    return InventoryMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteInventory(id: string): Promise<void> {
    const entity = await this.findById(id);
    return this.delete(entity);
  }
}
