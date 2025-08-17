import { DomainUnitEntity } from '@domain/warehouse/entities/unit.entity';
import { Unit } from '../entities/unit.entity';

export class UnitMapper {
  static entityInfraToDomain(infraEntity: Unit): DomainUnitEntity {
    if (!infraEntity) return null;
    
    return new DomainUnitEntity({
      id: infraEntity.id,
      name: infraEntity.name,
      description: infraEntity.description,
      conversionRate: infraEntity.conversionRate,
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      createdBy: infraEntity.createdBy,
      updatedBy: infraEntity.updatedBy,
    });
  }

  static entityDomainToInfra(domainEntity: DomainUnitEntity): Unit {
    if (!domainEntity) return null;
    
    const infraEntity = new Unit();
    infraEntity.id = domainEntity.getId();
    infraEntity.name = domainEntity.getName();
    infraEntity.description = domainEntity.getDescription();
    infraEntity.conversionRate = domainEntity.getConversionRate();
    infraEntity.createdAt = domainEntity.getCreatedAt();
    infraEntity.updatedAt = domainEntity.getUpdatedAt();
    infraEntity.createdBy = domainEntity.getCreatedBy();
    infraEntity.updatedBy = domainEntity.getUpdatedBy();
    
    return infraEntity;
  }

  // TODO: Add mapping methods
} 
