import { VariantService } from '@domain/product/services/variant.service';
import { DomainInventoryEntity } from '@domain/warehouse/entities';
import { InventoryService, UnitService } from '@domain/warehouse/services';
import { Injectable } from '@nestjs/common';
import { InventoryStatus } from '@share/types';
import { WarehouseService } from 'src/domain/warehouse/services/warehouse.service';

@Injectable()
export class WarehouseApplicationService {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly variantService: VariantService,
    private readonly inventoryService: InventoryService,
    private readonly unitService: UnitService,
  ) {}

  async checkIn(
    warehouseId: string,
    variantId: string,
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
      const [existingWarehouse, existingVariant, existingUnit] =
        await Promise.all([
          this.warehouseService.findByIdWarehouse(warehouseId),
          this.variantService.findById(variantId),
          this.unitService.findById(unitId),
        ]);

      if (!existingWarehouse || !existingVariant || !existingUnit) {
        throw new Error('Warehouse, Variant, or Unit not found');
      }

      // 2.Perform check-in
      const data = await this.inventoryService.checkInInventory(
        warehouseId,
        variantId,
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
    variantId: string,
    unitId: string,
    quantity: number,
    status: InventoryStatus,
  ): Promise<
    | { status: string; data: DomainInventoryEntity }
    | { status: string; error: any }
  > {
    try {
      // 1.Check if entities exist
      const [existingWarehouse, existingVariant, existingUnit] =
        await Promise.all([
          this.warehouseService.findByIdWarehouse(warehouseId),
          this.variantService.findById(variantId),
          this.unitService.findById(unitId),
        ]);

      if (!existingWarehouse || !existingVariant || !existingUnit) {
        throw new Error('Warehouse, Variant, or Unit not found');
      }

      // 2.Perform check-in
      const data = await this.inventoryService.checkOutInventory(
        warehouseId,
        variantId,
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
    variantId: string,
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
      const [existingWarehouse, existingVariant, existingUnit] =
        await Promise.all([
          this.warehouseService.findByIdWarehouse(warehouseId),
          this.variantService.findById(variantId),
          this.unitService.findById(unitId),
        ]);

      if (!existingWarehouse || !existingVariant || !existingUnit) {
        throw new Error('Warehouse, Variant, or Unit not found');
      }

      // 2.Perform check-in
      const data = await this.inventoryService.adjustQuantity(
        warehouseId,
        variantId,
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
    variantId: string,
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
        existingVariant,
        existingUnit,
      ] = await Promise.all([
        this.warehouseService.findByIdWarehouse(sourceWarehouseId),
        this.warehouseService.findByIdWarehouse(targetWarehouseId),
        this.variantService.findById(variantId),
        this.unitService.findById(unitId),
      ]);

      if (
        !existingSourceWarehouse ||
        !existingTargetWarehouse ||
        !existingVariant ||
        !existingUnit
      ) {
        throw new Error('Warehouse, Variant, or Unit not found');
      }

      // 2.Perform check-in
      const data = await this.inventoryService.transferInventory(
        sourceWarehouseId,
        targetWarehouseId,
        variantId,
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
