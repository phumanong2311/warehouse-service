import { DomainRackEntity } from '@domain/warehouse/entities/rack.entity';
import { Rack } from '../entities/rack.entity';

// TODO: Implement RackMapper
export class RackMapper {
  static entityInfraToDomain(infraEntity: Rack): DomainRackEntity {
    if (!infraEntity) return null;
    
    return new DomainRackEntity({
      id: infraEntity.id,
      name: infraEntity.name,
      warehouseId: infraEntity.warehouse?.id,
      variants: [], // TODO: Map variants if needed
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      createdBy: infraEntity.createdBy,
      updatedBy: infraEntity.updatedBy,
    });
  }

  static entityDomainToInfra(domainEntity: DomainRackEntity): Rack {
    if (!domainEntity) return null;
    
    const infraEntity = new Rack();
    infraEntity.id = domainEntity.getId();
    infraEntity.name = domainEntity.getName();
    infraEntity.createdAt = domainEntity.getCreatedAt();
    infraEntity.updatedAt = domainEntity.getUpdatedAt();
    infraEntity.createdBy = domainEntity.getCreatedBy();
    infraEntity.updatedBy = domainEntity.getUpdatedBy();
    
    // Note: warehouse and variants relationships will be handled by repository
    // This is just for reference
    
    return infraEntity;
  }

  // TODO: Add mapping methods
} 
