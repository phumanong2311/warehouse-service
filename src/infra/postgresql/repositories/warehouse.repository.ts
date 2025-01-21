import { DomainWarehouseEntity } from '@domain/warehouse/entities';
import { WarehouseMapper } from '@domain/warehouse/mapper';
import { Warehouse } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

export class WarehouseRepository extends BaseRepository<Warehouse> {
  async findByIdWarehouse(id: string): Promise<DomainWarehouseEntity> {
    const data = await this.findById(id);
    return WarehouseMapper.entityInfraToDomain(data);
  }

  async findByCode(code: string): Promise<DomainWarehouseEntity> {
    const data = await this.findOne({ code });
    return WarehouseMapper.entityInfraToDomain(data);
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
    sort?: { field: string; order: 'ASC' | 'DESC' };
    relations?: string[];
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }> {
    const { data, total } = await this.findPagination(query);
    const mappedData = data.map(WarehouseMapper.entityInfraToDomain);
    return { data: mappedData, total };
  }

  async findAllWarehouses(): Promise<DomainWarehouseEntity[]> {
    const data = await this.findAll();
    return data.map(WarehouseMapper.entityInfraToDomain);
  }

  async saveAndReturnDomain(
    warehouse: DomainWarehouseEntity,
  ): Promise<DomainWarehouseEntity> {
    const entity = WarehouseMapper.entityDomainToInfra(warehouse);
    const savedEntity = await this.save(entity);
    return WarehouseMapper.entityInfraToDomain(savedEntity);
  }

  async updateAndReturnDomain(
    id: string,
    warehouse: Partial<DomainWarehouseEntity>,
  ): Promise<DomainWarehouseEntity> {
    if (!id) {
      throw new Error('ID is required to update the warehouse.');
    }
    const existingEntity = await this.findById(id);
    if (!existingEntity) {
      throw new Error(`Warehouse with ID ${id} not found.`);
    }
    const updatedData = { ...existingEntity, ...warehouse };
    const entityToUpdate = WarehouseMapper.entityDomainToInfra(updatedData);
    const updatedEntity = await this.update(id, entityToUpdate);
    return WarehouseMapper.entityInfraToDomain(updatedEntity);
  }

  async deleteWarehouse(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.delete(entity);
  }
}
