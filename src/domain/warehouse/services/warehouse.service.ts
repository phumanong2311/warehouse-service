import { Inject, Injectable } from '@nestjs/common';
import { PaginationWarehouseDto } from '../dtos';
import { DomainWarehouseEntity } from '../entities';
import { IWarehouseRepository } from '../interface-repositories/warehouse.interface.repository';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject('IWarehouseRepository')
    private warehouseRepository: IWarehouseRepository,
  ) {}
  //dung find khi du lieu co the tra ve null hoac undefined
  // dung get khi muốn đảm bảo lúc nào cũng trả về 1 giá trị, nếu không tìm thấy thì ném error
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
    // 2. Kiểm tra nếu mã code đã tồn tại (nếu `code` được gửi để cập nhật)
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
