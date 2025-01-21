import {
  DomainProductEntity,
  DomainVariantEntity,
} from '@domain/product/entities';
import { VariantService } from '@domain/product/services/variant.service';
import { WarehouseRepository } from '@infra/postgresql/repositories/warehouse.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryStatus } from '@share/types';
import { DomainUnitEntity, DomainWarehouseEntity } from '../entities';
import { IWarehouseRepository } from '../interface-repositories/warehouse.interface.repository';
import { InventoryService } from './inventory.service';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject(WarehouseRepository)
    private warehouseRepository: IWarehouseRepository,
    private variantService: VariantService,
    private inventoryService: InventoryService,
  ) {}
  //dung find khi du lieu co the tra ve null hoac undefined
  // dung get khi muốn đảm bảo lúc nào cũng trả về 1 giá trị, nếu không tìm thấy thì ném error
  async findById(warehouseId: string): Promise<DomainWarehouseEntity> {
    return await this.warehouseRepository.findById(warehouseId);
  }
  async findAll(): Promise<DomainWarehouseEntity[]> {
    return await this.warehouseRepository.findAll();
  }
  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainWarehouseEntity[]; total: number }> {
    return await this.warehouseRepository.findPagination(query);
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
  async addVariantToWarehouse(
    warehouse: DomainWarehouseEntity,
    variant: DomainVariantEntity,
    quantity: number,
    status: InventoryStatus,
    unit: DomainUnitEntity,
  ) {
    const existingWarehouse = await this.warehouseRepository.findByCode(
      warehouse.getCode(),
    );
    if (!existingWarehouse) {
      throw new Error(`Warehouse with id ${warehouse.getCode()} not found`);
    }
    const existingVariant = await this.variantService.findById(variant.getId());
    if (!existingVariant) {
      throw new Error(`Variant with id ${variant.getId()} not found`);
    }
    if (!quantity) {
      throw new Error(`Please enter quantity !`);
    }
    const existingInventory = await this.inventoryService.adjustQuantity(
      existingWarehouse,
      existingVariant,
      unit,
      quantity,
      status,
    );
    return existingInventory;
  }

  async removeVariantFromWarehouse(
    warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
  ) {}

  async updateVariantQuantity(
    warehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
  ) {}

  async transferVariantBetweenWarehouses(
    fromWarehouse: DomainWarehouseEntity,
    toWarehouse: DomainWarehouseEntity,
    product: DomainProductEntity,
    quantity: number,
  ) {}
}
