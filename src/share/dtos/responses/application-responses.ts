import { DomainInventoryEntity } from '@domain/warehouse/entities';
import { InventoryStatus } from '@share/types';

export class CheckInResponseSuccess {
  status: string;
  data: DomainInventoryEntity;
}

export class CheckInResponseFail {
  status: string;
  error: any;
}

export class CheckOutResponse {
  warehouseId: string;
  productId: string;
  unitId: string;
  quantity: number;
  status: InventoryStatus;
}

export class AdjustmentResponse {
  warehouseId: string;
  productId: string;
  unitId: string;
  quantity: number;
  status: InventoryStatus;
  batch?: string;
  expirationDate?: Date;
}

export class TransferResponse {
  sourceWarehouseId: string;
  targetWarehouseId: string;
  productId: string;
  unitId: string;
  status: InventoryStatus;
  quantity: number;
  expirationDate?: Date;
}
