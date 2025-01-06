import { DomainProductEntity } from '@domain/product/entities';
import { ProductService } from '@domain/product/services';
import { WarehouseRepository } from '@infra/postgresql/repositories/warehouse.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DomainWarehouseEntity } from '../entities';
import { IWarehouseRepository } from '../interface-repositories/warehouse.interface.repository';
import { InventoryService } from './inventory.service';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject(WarehouseRepository)
    private warehouseRepository: IWarehouseRepository,
    private productService: ProductService,
    private inventoryService: InventoryService
  ) { }
  async findById(warehouseId: string): Promise<DomainWarehouseEntity> {
    return await this.warehouseRepository.findByIdWithMapper(warehouseId);
  }
  async findAll(): Promise<DomainWarehouseEntity[]> {
    return await this.warehouseRepository.findAllWithMapper()
  }
  async create(warehouse: DomainWarehouseEntity): Promise<DomainWarehouseEntity> {
    if (!warehouse.getCode()) {
      throw new Error('Warehouse code is required');
    }
    if (!warehouse.getName()) {
      throw new Error('Warehouse name is required');
    }
    if (!warehouse.getPhone()) {
      throw new Error('Warehouse phone number is required');
    }

    const existingWarehouse = await this.warehouseRepository.findByCodeWithMapper(
      warehouse.getCode()
    );
    if (existingWarehouse) {
      throw new Error(`Warehouse with code ${warehouse.getCode()} already exists`);
    }
    return await this.warehouseRepository.saveAndReturnDomain(warehouse)
  }
  async update(id: string, warehouse: Partial<DomainWarehouseEntity>): Promise<DomainWarehouseEntity> {
    const existingWarehouse = await this.warehouseRepository.findByCodeWithMapper(
      warehouse.getCode()
    );
    if (!existingWarehouse) {
      throw new Error(`Warehouse with id ${id} not found`);
    }

    // 2. Kiểm tra nếu mã code đã tồn tại (nếu `code` được gửi để cập nhật)
    if (warehouse.getCode()) {
      throw new Error(`Warehouse with code ${warehouse.getCode()} already exists`);
    }
    return await this.warehouseRepository.updateAndReturnDomain(id, warehouse)
  };
  async delete(id: string): Promise<void> {
    return await this.warehouseRepository.deleteWarehouse(id)
  }
  async addProductToWarehouse(warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number) {
    const existingWarehouse = await this.warehouseRepository.findByCodeWithMapper(
      warehouse.getCode()
    );
    if (!existingWarehouse) {
      throw new Error(`Warehouse with id ${warehouse.getCode()} not found`);
    }
    const existingProduct = await this.productRepository.findById(
      product.getId()
    );
    if (!existingProduct) {
      throw new Error(`Warehouse with id ${product.getId()} not found`);
    }
    const existingInventory = await this.inv
  }

  async removeProductFromWarehouse(warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number) { }

  async updateProductQuantity(warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number) { }

  async transferProductBetweenWarehouses(fromWarehouse: DomainWarehouseEntity,
    toWarehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number) { }
}