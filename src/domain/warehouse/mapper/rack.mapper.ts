import { Rack as InfraRack } from '@infra/postgresql/entities';
import { DomainRackEntity } from '../entities';

export class RackMapper {
  static entityInfraToDomain(infra: InfraRack): DomainRackEntity {
    return new DomainRackEntity({
      id: infra.id,
      name: infra.name,
      warehouseId: infra.warehouse.id,
      productIds: infra.productIds || [],
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(domain: DomainRackEntity): InfraRack {
    const infra = new InfraRack();
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getName()) infra.name = domain.getName();
    if (domain.getWarehouse())
      infra.warehouse = { id: domain.getWarehouse() } as any;
    // Note: productIds are not mapped back to infra entities
    // as they should be managed by the product service
    return infra;
  }
}
