import { DomainInventoryEntity } from '@domain/warehouse/entities';
import { InventoryMapper } from '../mappers/inventory.mapper';
import { FilterQuery } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { InventoryStatus } from '@share/types';
import { Inventory } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class InventoryRepository extends BaseRepository<Inventory> {
  constructor(em: SqlEntityManager) {
    super(em, Inventory);
  }
  async findByIdInventory(id: string): Promise<DomainInventoryEntity> {
    const data = await this.findById(id);
    return InventoryMapper.entityInfraToDomain(data);
  }

  async findByWarehouseAndVariant(
    warehouseId: string,
    variantId: string,
    unitId: string,
    status: InventoryStatus,
    expirationDate?: Date,
  ): Promise<DomainInventoryEntity> {
    const data = await this.findOne({
      warehouse: warehouseId,
      variant: variantId,
      unit: unitId,
      status,
      expirationDate,
    });
    return InventoryMapper.entityInfraToDomain(data);
  }

  async findWithPagination(query: {
    warehouseId?: string;
    variantId?: string;
    unitId?: string;
    quantity?: number;
    status?: InventoryStatus;
    expirationDate?: Date;
    batch?: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: DomainInventoryEntity[]; total: number }> {
    const { limit, page, ...filters } = query;
    const where: FilterQuery<Inventory> = {};
    if (filters.warehouseId) {
      where.warehouse = filters.warehouseId;
    }
    if (filters.variantId) {
      where.variant = filters.variantId;
    }
    if (filters.unitId) {
      where.unit = filters.unitId;
    }
    if (filters.quantity) {
      where.quantity = filters.quantity;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.expirationDate) {
      where.expirationDate = filters.expirationDate;
    }
    if (filters.batch) {
      where.batch = filters.batch;
    }
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map((item) =>
      InventoryMapper.entityInfraToDomain(item),
    );
    return {
      data: mappedData,
      total,
    };
  }

  async findAllInventories(): Promise<DomainInventoryEntity[]> {
    const data = await this.findAll();
    return data.map((item) => InventoryMapper.entityInfraToDomain(item));
  }

  async createInventory(
    domainEntity: DomainInventoryEntity,
  ): Promise<DomainInventoryEntity> {
    const infraEntity = InventoryMapper.entityDomainToInfra(domainEntity);
    const data = await this.save(infraEntity);
    return InventoryMapper.entityInfraToDomain(data);
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
