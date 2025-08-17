import { DomainWarehouseEntity } from '@domain/warehouse/entities/warehouse.entity';
import { DomainRackEntity } from '@domain/warehouse/entities/rack.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Rack } from '../entities/rack.entity';

export class WarehouseMapper {
  static entityInfraToDomain(infraEntity: Warehouse): DomainWarehouseEntity {
    if (!infraEntity) return null;
    
    return new DomainWarehouseEntity({
      id: infraEntity.id,
      code: infraEntity.code,
      phone: infraEntity.phone,
      name: infraEntity.name,
      email: infraEntity.email,
      logo: infraEntity.logo,
      address: infraEntity.address,
      racks: infraEntity.racks ? infraEntity.racks.getItems().map(rack => 
        new DomainRackEntity({
          id: rack.id,
          name: rack.name,
          warehouseId: rack.warehouse.id,
          variants: [], // TODO: Map variants if needed
          createdAt: rack.createdAt,
          updatedAt: rack.updatedAt,
          createdBy: rack.createdBy,
          updatedBy: rack.updatedBy,
        })
      ) : [],
      createdAt: infraEntity.createdAt,
      updatedAt: infraEntity.updatedAt,
      createdBy: infraEntity.createdBy,
      updatedBy: infraEntity.updatedBy,
      registrationExpirationDate: infraEntity.registrationExpirationDate,
    });
  }

  static entityDomainToInfra(domainEntity: DomainWarehouseEntity): Warehouse {
    if (!domainEntity) return null;
    
    const infraEntity = new Warehouse();
    infraEntity.id = domainEntity.getId();
    infraEntity.code = domainEntity.getCode();
    infraEntity.phone = domainEntity.getPhone();
    infraEntity.name = domainEntity.getName();
    infraEntity.email = domainEntity.getEmail();
    infraEntity.logo = domainEntity.getLogo();
    infraEntity.address = domainEntity.getAddress();
    infraEntity.createdAt = domainEntity.getCreatedAt();
    infraEntity.updatedAt = domainEntity.getUpdatedAt();
    infraEntity.createdBy = domainEntity.getCreatedBy();
    infraEntity.updatedBy = domainEntity.getUpdatedBy();
    infraEntity.registrationExpirationDate = domainEntity.getRegistrationExpirationDate();
    
    // Map racks if they exist
    if (domainEntity.getRacks()) {
      // Note: Racks will be handled by repository layer
      // This is just for reference
    }
    
    return infraEntity;
  }
} 
