import { CreateWarehouseDto, UpdateWarehouseDto, PaginationWarehouseDto } from '../dtos/warehouse.dto';
import { DomainWarehouseEntity } from '@domain/warehouse/entities';
import { PaginationQuery } from '@domain/warehouse/interfaces/pagination.interface';
import { v4 as uuidv4 } from 'uuid';

export class WarehouseDtoMapper {
  static createDtoToDomainEntity(dto: CreateWarehouseDto): DomainWarehouseEntity {
    return new DomainWarehouseEntity({
      id: uuidv4(),
      name: dto.name,
      code: dto.code,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      description: dto.description,
      racks: [],
      registrationExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    });
  }

  static updateDtoToPartialDomainEntity(dto: UpdateWarehouseDto): Partial<DomainWarehouseEntity> {
    const partial: any = {};
    
    if (dto.name !== undefined) partial.name = dto.name;
    if (dto.code !== undefined) partial.code = dto.code;
    if (dto.phone !== undefined) partial.phone = dto.phone;
    if (dto.email !== undefined) partial.email = dto.email;
    if (dto.address !== undefined) partial.address = dto.address;
    if (dto.description !== undefined) partial.description = dto.description;
    
    return partial;
  }

  static paginationDtoToQuery(dto: PaginationWarehouseDto): PaginationQuery {
    return {
      limit: dto.limit,
      page: dto.page,
      name: dto.name,
      code: dto.code,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      createdBy: dto.createdBy,
      updatedBy: dto.updatedBy,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      sort: dto.sort ? {
        field: dto.sort.field,
        order: dto.sort.order,
      } : undefined,
    };
  }
}
