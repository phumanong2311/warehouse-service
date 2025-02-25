import {
  FilterType,
  PaginationWarehouseDto,
  SortType,
} from '@domain/warehouse/dtos';
import { DomainWarehouseEntity } from '@domain/warehouse/entities';
import { IWarehouseRepository } from '@domain/warehouse/interface-repositories';
import { WarehouseMapper } from '@domain/warehouse/mapper';
import {
  OrderDefinition,
  Populate,
  SqlEntityManager,
} from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Warehouse } from 'src/infra/postgresql/entities';
import { BaseRepository } from 'src/infra/postgresql/repositories/base.repository';

@Injectable()
export class WarehouseRepository
  extends BaseRepository<Warehouse>
  implements IWarehouseRepository
{
  constructor(em: SqlEntityManager) {
    super(em, Warehouse);
  }
  async findByIdWarehouse(id: string): Promise<DomainWarehouseEntity> {
    try {
      const data = await this.findOne(
        { id },
        { populate: ['racks', 'racks.variants'] },
      );

      if (!data) {
        console.warn(`Warehouse with ID ${id} not found.`);
        throw new NotFoundException(`Warehouse with ID ${id} not found.`);
      }

      console.log(`Warehouse found:`, data);
      return WarehouseMapper.entityInfraToDomain(data);
    } catch (error) {
      console.error(`Error in findByIdWarehouse:`, error.message);
      throw error;
    }
  }

  async findByCode(code: string): Promise<DomainWarehouseEntity> {
    const data = await this.findOne({ code });
    return WarehouseMapper.entityInfraToDomain(data);
  }

  // Hàm pagination với filter & sort
  // example: http://localhost:3000/warehouse?limit=10&page=1&name=Apple&sort[field]=create_at&sort[order]=DESC
  async findWithPagination(query: PaginationWarehouseDto): Promise<{
    data: DomainWarehouseEntity[];
    total: number;
    totalPages: number;
  }> {
    const {
      limit = 10,
      page = 1,
      name,
      code,
      address,
      email,
      phone,
      created_at,
      updated_at,
      created_by,
      updated_by,
      sort,
    } = query;
    const offset = (page - 1) * limit;
    const filters: Record<string, any> = {};

    // Kiểm tra nếu có tham số tìm kiếm cho từng trường cụ thể
    if (name) {
      filters.name = { $ilike: `%${name}%` };
    }
    if (email) {
      filters.email = { $ilike: `%${email}%` };
    }
    if (address) {
      filters.address = { $ilike: `%${address}%` };
    }
    if (code) {
      filters.code = { $ilike: `%${code}%` };
    }
    if (phone) {
      filters.phone = { $ilike: `%${phone}%` };
    }
    if (created_at) {
      filters.created_at = { $ilike: `%${created_at}%` };
    }
    if (updated_at) {
      filters.updated_at = { $ilike: `%${updated_at}%` };
    }
    if (created_by) {
      filters.created_by = { $ilike: `%${created_by}%` };
    }
    if (updated_by) {
      filters.updated_by = { $ilike: `%${updated_by}%` };
    }

    const orderBy: OrderDefinition<Warehouse> =
      sort && sort.field && sort.order
        ? { [sort.field]: sort.order }
        : { createdAt: 'DESC' };

    // Truy vấn MikroORM với filters, sort, pagination
    const [data, total] = await this.em.findAndCount(Warehouse, filters, {
      limit,
      offset,
      orderBy,
    });

    // Kiểm tra dữ liệu hợp lệ
    if (!Array.isArray(data)) {
      throw new Error('findAndCount did not return an array.');
    }

    let mappedData: DomainWarehouseEntity[];
    let totalPages: number = 0;

    if (data) {
      mappedData = data.map((item) =>
        WarehouseMapper.entityInfraToDomain(item),
      );
      totalPages = Math.ceil(total / limit);
    }

    return {
      data: mappedData,
      total,
      totalPages,
    };
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
