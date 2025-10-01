import { 
  CreateInventoryDto, 
  UpdateInventoryDto, 
  CheckInInventoryDto, 
  CheckOutInventoryDto,
  TransferInventoryDto,
  AdjustInventoryDto,
  WriteOffInventoryDto,
  PhysicalCountAdjustmentDto,
  PaginationInventoryDto
} from '../dtos/warehouse.dto';
import { DomainInventoryEntity } from '@domain/warehouse/entities';
import { InventoryStatus } from '@share/types';
import { v4 as uuidv4 } from 'uuid';

export class InventoryDtoMapper {
  static createDtoToDomainEntity(dto: CreateInventoryDto): DomainInventoryEntity {
    return new DomainInventoryEntity({
      id: uuidv4(),
      warehouseId: dto.warehouseId,
      productId: dto.productId,
      unitId: dto.unitId,
      quantity: dto.quantity,
      status: dto.status || InventoryStatus.AVAILABLE,
      batch: dto.batch,
      expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : undefined,
    });
  }

  static updateDtoToPartialDomainEntity(dto: UpdateInventoryDto): Partial<DomainInventoryEntity> {
    const partial = new DomainInventoryEntity({});
    
    if (dto.warehouseId !== undefined) partial.setWarehouse(dto.warehouseId);
    if (dto.productId !== undefined) partial.setProduct(dto.productId);
    if (dto.unitId !== undefined) partial.setUnit(dto.unitId);
    if (dto.quantity !== undefined) partial.setQuantity(dto.quantity);
    if (dto.status !== undefined) partial.setStatus(dto.status);
    if (dto.batch !== undefined) partial.setBatch(dto.batch);
    if (dto.expirationDate !== undefined) partial.setExpirationDate(new Date(dto.expirationDate));
    
    return partial;
  }

  static checkInDtoToParams(dto: CheckInInventoryDto) {
    return {
      warehouseId: dto.warehouseId,
      productId: dto.productId,
      unitId: dto.unitId,
      quantity: dto.quantity,
      status: dto.status,
      batch: dto.batch,
      expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : undefined,
    };
  }

  static checkOutDtoToParams(dto: CheckOutInventoryDto) {
    return {
      warehouseId: dto.warehouseId,
      productId: dto.productId,
      unitId: dto.unitId,
      quantity: dto.quantity,
      status: dto.status,
    };
  }

  static transferDtoToParams(dto: TransferInventoryDto) {
    return {
      sourceWarehouseId: dto.fromWarehouseId,
      targetWarehouseId: dto.toWarehouseId,
      productId: dto.productId,
      unitId: dto.unitId,
      quantity: dto.quantity,
      status: dto.status,
    };
  }

  static adjustDtoToParams(dto: AdjustInventoryDto) {
    return {
      warehouseId: dto.warehouseId,
      productId: dto.productId,
      unitId: dto.unitId,
      quantity: dto.adjustmentQuantity,
      reason: dto.reason,
      notes: dto.notes,
    };
  }

  static writeOffDtoToParams(dto: WriteOffInventoryDto) {
    return {
      warehouseId: dto.warehouseId,
      productId: dto.productId,
      unitId: dto.unitId,
      quantity: dto.quantity,
      reason: dto.reason,
      notes: dto.notes,
    };
  }

  static physicalCountDtoToParams(dto: PhysicalCountAdjustmentDto) {
    return {
      warehouseId: dto.warehouseId,
      productId: dto.productId,
      unitId: dto.unitId,
      physicalCount: dto.physicalCount,
      reason: dto.reason,
      notes: dto.notes,
    };
  }

  static paginationDtoToQuery(dto: PaginationInventoryDto) {
    return {
      limit: dto.limit,
      page: dto.page,
      warehouseId: dto.warehouseId,
      productId: dto.productId,
      unitId: dto.unitId,
      status: dto.status,
    };
  }
}
