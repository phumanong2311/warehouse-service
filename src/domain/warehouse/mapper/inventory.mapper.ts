import {
  Inventory as InfraInventory,
  Warehouse,
} from '@infra/postgresql/entities';
import { DomainInventoryEntity } from '../entities';

export class InventoryMapper {
  static entityInfraToDomain(infra: InfraInventory): DomainInventoryEntity {
    return new DomainInventoryEntity({
      id: infra.id,
      warehouseId: infra.warehouse.id,
      rackId: infra.rackId,
      productId: infra.productId,
      unitId: infra.unit?.id,
      quantity: infra.quantity,
      batch: infra.batch,
      expirationDate: infra.expirationDate,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(
    domain: Partial<DomainInventoryEntity>,
    warehouse?: Warehouse,
  ): InfraInventory {
    const infra = new InfraInventory();
    infra.id = domain.getId();
    if (warehouse) infra.warehouse = warehouse;
    infra.rackId = domain.getRack();
    infra.productId = domain.getProduct();
    // Note: unit will be set separately in repository
    infra.quantity = domain.getQuantity();
    infra.batch = domain.getBatch();
    infra.expirationDate = domain.getExpirationDate();
    infra.createdAt = domain.getCreatedAt();
    infra.updatedAt = domain.getUpdatedAt();
    infra.createdBy = domain.getCreatedBy();
    infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
