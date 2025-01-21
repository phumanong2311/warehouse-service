import { VariantService } from '@domain/product/services/variant.service';
import { InventoryService } from '@domain/warehouse/services';
import { Injectable } from '@nestjs/common';
import { InventoryStatus } from '@share/types';
import { WarehouseService } from 'src/domain/warehouse/services/warehouse.service';

@Injectable()
export class WarehouseApplicationService {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly variantService: VariantService,
    private readonly inventoryService: InventoryService,
    private readonly unitService: UnitS
  ) {}

  async checkIn(
    variantId: string,
    quantity: number,
    warehouseId: string,
    unitId: string,
    status: InventoryStatus,
  ) {
    // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
    const existingWarehouse = await this.warehouseService.findById(warehouseId);
    const existingVariant = await this.variantService.findById(variantId);
    const existingUnit = await this.

    if (!existingWarehouse || !existingVariant) {
      throw new Error('Warehouse or Variant not found');
    }

    // 2. Thực hiện nghiệp vụ check-in
    const data = await this.inventoryService.checkInInventory(
      existingWarehouse,
      existingVariant,

    )

    return { success: true };
  }

  async checkOutProduct(
    productId: string,
    quantity: number,
    warehouseId: string,
  ) {
    const warehouse = await this.warehouseService.findById(warehouseId);
    const product = await this.productService.findById(productId);

    if (!warehouse || !product) {
      throw new Error('Warehouse or Product not found');
    }

    await this.warehouseService.removeProductFromWarehouse(
      warehouse,
      product,
      quantity,
    );

    return { success: true };
  }

  async adjustStock(
    productId: string,
    newQuantity: number,
    warehouseId: string,
  ) {
    const warehouse = await this.warehouseService.findById(warehouseId);
    const product = await this.productService.findById(productId);

    if (!warehouse || !product) {
      throw new Error('Warehouse or Product not found');
    }

    await this.warehouseService.updateProductQuantity(
      warehouse,
      product,
      newQuantity,
    );

    return { success: true };
  }

  async transferProduct(
    productId: string,
    quantity: number,
    fromWarehouseId: string,
    toWarehouseId: string,
  ) {
    const fromWarehouse = await this.warehouseService.findById(fromWarehouseId);
    const toWarehouse = await this.warehouseService.findById(toWarehouseId);
    const product = await this.productService.findById(productId);

    if (!fromWarehouse || !toWarehouse || !product) {
      throw new Error('Warehouse or Product not found');
    }

    await this.warehouseService.transferProductBetweenWarehouses(
      fromWarehouse,
      toWarehouse,
      product,
      quantity,
    );

    return { success: true };
  }
}
