import { DomainProductEntity } from '@domain/product/entities';
import { ProductService } from '@domain/product/services';
import { WarehouseRepository } from '@infra/postgresql/repositories/warehouse.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryStatus } from '@share/types';
import { DomainWarehouseEntity } from '../entities';
import { IWarehouseRepository } from '../interface-repositories/warehouse.interface.repository';
import { InventoryService } from './inventory.service';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject(WarehouseRepository)
    private warehouseRepository: IWarehouseRepository,
    private productService: ProductService,
    private inventoryService: InventoryService,
  ) {}
  //dung find khi du lieu co the tra ve null hoac undefined
  // dung get khi muốn đảm bảo lúc nào cũng trả về 1 giá trị, nếu không tìm thấy thì ném error
  async findById(warehouseId: string): Promise<DomainWarehouseEntity> {
    return await this.warehouseRepository.findByIdWithMapper(warehouseId);
  }
  async findAll(): Promise<DomainWarehouseEntity[]> {
    return await this.warehouseRepository.findAllWithMapper();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }> {
    return await this.warehouseRepository.findPaginationWithMapper(query);
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

    const isExit = await this.warehouseRepository.findByCodeWithMapper(
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
    const isExit = await this.warehouseRepository.findByCodeWithMapper(
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
  async addProductToWarehouse(
    warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
    status: InventoryStatus,
  ) {
    const existingWarehouse =
      await this.warehouseRepository.findByCodeWithMapper(warehouse.getCode());
    if (!existingWarehouse) {
      throw new Error(`Warehouse with id ${warehouse.getCode()} not found`);
    }
    const existingProduct = await this.productService.findById(product.getId());
    if (!existingProduct) {
      throw new Error(`Warehouse with id ${product.getId()} not found`);
    }
    if (!quantity) {
      throw new Error(`Please enter quantity !`);
    }
    const existingInventory = await this.inventoryService.adjustQuantity(
      existingWarehouse,
      existingProduct,
      quantity,
      status,
    );
  }

  async removeProductFromWarehouse(
    warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
  ) {}

  async updateProductQuantity(
    warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
  ) {}

  async transferProductBetweenWarehouses(
    fromWarehouse: DomainWarehouseEntity,
    toWarehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
  ) {}
}
