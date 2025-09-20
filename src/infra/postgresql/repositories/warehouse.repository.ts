import { DomainWarehouseEntity } from '@domain/warehouse/entities';
import { IWarehouseRepository } from '@domain/warehouse/interface-repositories';
import { PaginationQuery, PaginationResult } from '@domain/warehouse/interfaces/pagination.interface';
import { WarehouseMapper } from '@domain/warehouse/mapper';
import { OrderDefinition, SqlEntityManager } from '@mikro-orm/postgresql';
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
        { populate: ['racks', 'racks.warehouse'] },
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
  async findWithPagination(query: PaginationQuery): Promise<PaginationResult<DomainWarehouseEntity>> {
    const {
      limit = 10,
      page = 1,
      name,
      code,
      address,
      email,
      phone,
      createdAt,
      updatedAt,
      createdBy,
      updatedBy,
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
    if (createdAt) {
      filters.createdAt = { $ilike: `%${createdAt}%` };
    }
    if (updatedAt) {
      filters.updatedAt = { $ilike: `%${updatedAt}%` };
    }
    if (createdBy) {
      filters.createdBy = { $ilike: `%${createdBy}%` };
    }
    if (updatedBy) {
      filters.updatedBy = { $ilike: `%${updatedBy}%` };
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
      page,
      limit,
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
