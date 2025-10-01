import { InventoryStatus } from '@share/types';

export class CheckInRequest {
  warehouseId: string;
  productId: string;
  unitId: string;
  quantity: number;
  status: InventoryStatus;
  expirationDate?: Date;
  batch?: string;
}

export class CheckOutRequest {
  warehouseId: string;
  productId: string;
  unitId: string;
  quantity: number;
  status: InventoryStatus;
}

export class AdjustmentRequest {
  warehouseId: string;
  productId: string;
  unitId: string;
  quantity: number;
  status: InventoryStatus;
  batch?: string;
  expirationDate?: Date;
}

export class TransferRequest {
  sourceWarehouseId: string;
  targetWarehouseId: string;
  productId: string;
  unitId: string;
  status: InventoryStatus;
  quantity: number;
  expirationDate?: Date;
}
