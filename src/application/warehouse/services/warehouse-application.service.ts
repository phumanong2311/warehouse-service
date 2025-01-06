import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/domain/product/services/product.service';
import { WarehouseService } from 'src/domain/warehouse/services/warehouse.service';

@Injectable()
export class WarehouseApplicationService {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly productService: ProductService,
  ) {}

  async checkInProduct(
    productId: string,
    quantity: number,
    warehouseId: string,
  ) {
    // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
    const warehouse = await this.warehouseService.findById(warehouseId);
    const product = await this.productService.findById(productId);

    if (!warehouse || !product) {
      throw new Error('Warehouse or Product not found');
    }

    // 2. Thực hiện nghiệp vụ check-in
    await this.warehouseService.addProductToWarehouse(
      warehouse,
      product,
      quantity,
    );

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
