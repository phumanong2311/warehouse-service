import { VariantMapper } from '@domain/product/mapper/variant.mapper';
import { Inventory as InfraInventory } from '@infra/postgresql/entities';
import { DomainInventoryEntity } from '../entities';
import { WarehouseMapper } from './warehouse.mapper';

export class InventoryMapper {
  static entityInfraToDomain(infra: InfraInventory): DomainInventoryEntity {
    return new DomainInventoryEntity({
      id: infra.id,
      warehouse: WarehouseMapper.entityInfraToDomain(infra.warehouse),
      variant: VariantMapper.entityInfraToDomain(infra.variant),
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
  ): InfraInventory {
    const infra = new InfraInventory();
    infra.id = domain.getId();
    infra.warehouse = WarehouseMapper.entityDomainToInfra(
      domain.getWarehouse(),
    );
    infra.variant = VariantMapper.entityDomainToInfra(domain.getVariant());
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
