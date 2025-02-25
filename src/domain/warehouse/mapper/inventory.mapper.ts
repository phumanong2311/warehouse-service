import {
  Inventory as InfraInventory,
  Variant,
  Warehouse,
} from '@infra/postgresql/entities';
import { DomainInventoryEntity } from '../entities';

export class InventoryMapper {
  static entityInfraToDomain(infra: InfraInventory): DomainInventoryEntity {
    return new DomainInventoryEntity({
      id: infra.id,
      warehouseId: infra.warehouse.id,
      variantId: infra.variant.id,
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
    variant?: Variant,
  ): InfraInventory {
    const infra = new InfraInventory();
    infra.id = domain.getId();
    if (warehouse) infra.warehouse = warehouse;
    if (variant) infra.variant = variant;
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
