import { Inject, Injectable } from '@nestjs/common';
import { DomainWarehouseEntity } from '../entities';
import { WarehouseRepository } from '@infra/postgresql/repositories/warehouse.repository';
import { IWarehouseRepository } from '../interface-repositories/warehouse.interface.repository';
import { WarehouseMapper } from '../mapper';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject(WarehouseRepository)
    private warehouseRepository: IWarehouseRepository,
  ) { }
  async findById(warehouseId: string): Promise<DomainWarehouseEntity> {
    return await this.warehouseRepository.findByIdWithMapper(warehouseId);
  }
  async findAll(): Promise<DomainWarehouseEntity[]> {
    return await this.warehouseRepository.findAllWithMapper()
  }
  async create() { }
  async update() { }
  async delete() { }
  async addProductToWarehouse() { }
  async removeProductFromWarehouse() { }
  async updateProductQuantity() { }
  async transferProductBetweenWarehouses() { }
}
