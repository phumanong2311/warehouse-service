import { InventoryStatus } from '@share/types';

export class CheckInRequest {
  warehouseId: string;
  variantId: string;
  unitId: string;
  quantity: number;
  status: InventoryStatus;
  expirationDate?: Date;
  batch?: string;
}

export class CheckOutRequest {
  warehouseId: string;
  variantId: string;
  unitId: string;
  quantity: number;
  status: InventoryStatus;
}

export class AdjustmentRequest {
  warehouseId: string;
  variantId: string;
  unitId: string;
  quantity: number;
  status: InventoryStatus;
  batch?: string;
  expirationDate?: Date;
}

export class TransferRequest {
  sourceWarehouseId: string;
  targetWarehouseId: string;
  variantId: string;
  unitId: string;
  status: InventoryStatus;
  quantity: number;
  expirationDate?: Date;
}
