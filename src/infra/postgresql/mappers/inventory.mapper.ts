import { DomainInventoryEntity } from '@domain/warehouse/entities/inventory.entity';
import { Inventory } from '../entities/inventory.entity';

export class InventoryMapper {
  static entityInfraToDomain(infraEntity: Inventory): DomainInventoryEntity {
    if (!infraEntity) return null;
    
    return new DomainInventoryEntity({
      id: infraEntity.id,
      warehouseId: infraEntity.warehouse?.id,
      variantId: infraEntity.variant?.id,
      unitId: infraEntity.unit?.id,
      quantity: infraEntity.quantity,
      batch: infraEntity.batch,
      expirationDate: infraEntity.expirationDate,
      status: infraEntity.status,
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      createdBy: infraEntity.createdBy,
      updatedBy: infraEntity.updatedBy,
    });
  }

  static entityDomainToInfra(domainEntity: DomainInventoryEntity): Inventory {
    if (!domainEntity) return null;
    
    const infraEntity = new Inventory();
    infraEntity.id = domainEntity.getId();
    infraEntity.quantity = domainEntity.getQuantity();
    infraEntity.batch = domainEntity.getBatch();
    infraEntity.expirationDate = domainEntity.getExpirationDate();
    infraEntity.status = domainEntity.getStatus();
    infraEntity.createdAt = domainEntity.getCreatedAt();
    infraEntity.updatedAt = domainEntity.getUpdatedAt();
    infraEntity.createdBy = domainEntity.getCreatedBy();
    infraEntity.updatedBy = domainEntity.getUpdatedBy();
    
    // Note: warehouse, variant, unit relationships will be handled by repository
    // This is just for reference
    
    return infraEntity;
  }

  // TODO: Add mapping methods
} 
