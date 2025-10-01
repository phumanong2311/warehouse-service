import { DomainInventoryEntity } from '@domain/warehouse/entities';
import { InventoryService, UnitService } from '@domain/warehouse/services';
import { Injectable } from '@nestjs/common';
import { InventoryStatus } from '@share/types';
import { WarehouseService } from 'src/domain/warehouse/services/warehouse.service';

@Injectable()
export class WarehouseApplicationService {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly inventoryService: InventoryService,
    private readonly unitService: UnitService,
  ) {}

  async checkIn(
    warehouseId: string,
    productId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    expirationDate?: Date,
    batch?: string,
  ): Promise<
    | { status: string; data: DomainInventoryEntity }
    | { status: string; error: any }
  > {
    try {
      // 1.Check if entities exist
      const [existingWarehouse, existingUnit] =
        await Promise.all([
          this.warehouseService.findByIdWarehouse(warehouseId),
          this.unitService.findById(unitId),
        ]);

      if (!existingWarehouse || !existingUnit) {
        throw new Error('Warehouse or Unit not found');
      }

      // 2.Perform check-in
      const data = await this.inventoryService.checkInInventory(
        warehouseId,
        productId,
        unitId,
        quantity,
        status,
        expirationDate,
        batch,
      );

      return { status: 'success', data };
    } catch (error) {
      console.error('Error during check-in:', error);
      return {
        status: 'fail',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async checkOut(
    warehouseId: string,
    productId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
  ): Promise<
    | { status: string; data: DomainInventoryEntity }
    | { status: string; error: any }
  > {
    try {
      // 1.Check if entities exist
      const [existingWarehouse, existingUnit] =
        await Promise.all([
          this.warehouseService.findByIdWarehouse(warehouseId),
          this.unitService.findById(unitId),
        ]);

      if (!existingWarehouse || !existingUnit) {
        throw new Error('Warehouse or Unit not found');
      }

      // 2.Perform check-in
      const data = await this.inventoryService.checkOutInventory(
        warehouseId,
        productId,
        unitId,
        quantity,
        status,
      );

      return { status: 'success', data };
    } catch (error) {
      console.error('Error during check-in:', error);
      return {
        status: 'fail',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async adjustStock(
    warehouseId: string,
    productId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
    batch?: string,
    expirationDate?: Date,
  ): Promise<
    | { status: string; data: DomainInventoryEntity }
    | { status: string; error: any }
  > {
    try {
      // 1.Check if entities exist
      const [existingWarehouse, existingUnit] =
        await Promise.all([
          this.warehouseService.findByIdWarehouse(warehouseId),
          this.unitService.findById(unitId),
        ]);

      if (!existingWarehouse || !existingUnit) {
        throw new Error('Warehouse or Unit not found');
      }

      // 2.Perform check-in
      const data = await this.inventoryService.adjustQuantity(
        warehouseId,
        productId,
        unitId,
        quantity,
        status,
        batch,
        expirationDate,
      );

      return { status: 'success', data };
    } catch (error) {
      console.error('Error during check-in:', error);
      return {
        status: 'fail',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async transferProduct(
    sourceWarehouseId: string,
    targetWarehouseId: string,
    productId: string,
    unitId: string,
    status: InventoryStatus,
    quantity: number,
    expirationDate?: Date,
  ) {
    try {
      // 1.Check if entities exist
      const [
        existingSourceWarehouse,
        existingTargetWarehouse,
        existingUnit,
      ] = await Promise.all([
        this.warehouseService.findByIdWarehouse(sourceWarehouseId),
        this.warehouseService.findByIdWarehouse(targetWarehouseId),
        this.unitService.findById(unitId),
      ]);

      if (
        !existingSourceWarehouse ||
        !existingTargetWarehouse ||
        !existingUnit
      ) {
        throw new Error('Warehouse or Unit not found');
      }

      // 2.Perform check-in
      const data = await this.inventoryService.transferInventory(
        sourceWarehouseId,
        targetWarehouseId,
        productId,
        unitId,
        status,
        quantity,
        expirationDate,
      );

      return { status: 'success', data };
    } catch (error) {
      console.error('Error during check-in:', error);
      return {
        status: 'fail',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }
}
