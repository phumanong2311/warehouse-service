import { Inject, Injectable } from '@nestjs/common';
import { DomainWarehouseEntity } from '../../../domain/warehouse/entities/warehouse.entity';
import { IWarehouseRepository } from '../../../domain/warehouse/interface-repositories/warehouse.interface.repository';
import { PaginationWarehouseDto } from '../dtos/pagination-warehouse.dto';
import { IWarehouseService } from '../interfaces/warehouse.service';

@Injectable()
export class WarehouseApplicationService implements IWarehouseService {
  constructor(
    @Inject('IWarehouseRepository')
    private warehouseRepository: IWarehouseRepository,
  ) {}

  async findByIdWarehouse(warehouseId: string): Promise<DomainWarehouseEntity> {
    return await this.warehouseRepository.findByIdWarehouse(warehouseId);
  }

  async findAll(): Promise<DomainWarehouseEntity[]> {
    return await this.warehouseRepository.findAllWarehouses();
  }

  async findWithPagination(
    query: PaginationWarehouseDto,
  ): Promise<{ data: DomainWarehouseEntity[]; total: number }> {
    return await this.warehouseRepository.findWithPagination(query);
  }

  async create(
    warehouse: DomainWarehouseEntity,
  ): Promise<DomainWarehouseEntity> {
    if (!warehouse.getCode()) {
      throw new Error('Warehouse code is required');
    }
    if (!warehouse.getName()) {
      throw new Error('Warehouse name is required');
    }
    if (!warehouse.getPhone()) {
      throw new Error('Warehouse phone number is required');
    }

    const isExit = await this.warehouseRepository.findByCode(
      warehouse.getCode(),
    );
    if (isExit) {
      throw new Error(
        `Warehouse with code ${warehouse.getCode()} already exists`,
      );
    }
    return await this.warehouseRepository.saveAndReturnDomain(warehouse);
  }

  async update(
    id: string,
    warehouse: Partial<DomainWarehouseEntity>,
  ): Promise<DomainWarehouseEntity> {
    const isExit = await this.warehouseRepository.findByCode(
      warehouse.getCode(),
    );
    if (!isExit) {
      throw new Error(`Warehouse with id ${id} not found`);
    }
    if (warehouse.getCode()) {
      throw new Error(
        `Warehouse with code ${warehouse.getCode()} already exists`,
      );
    }
    return await this.warehouseRepository.updateAndReturnDomain(id, warehouse);
  }

  async delete(id: string): Promise<void> {
    return await this.warehouseRepository.deleteWarehouse(id);
  }
} 
