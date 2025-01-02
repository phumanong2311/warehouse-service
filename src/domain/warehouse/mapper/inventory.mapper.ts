import { ProductMapper } from '@domain/product/mapper';
import { Inventory as InfraInventory } from '@infra/postgresql/entities';
import { DomainInventoryEntity } from '../entities';
import { WarehouseMapper } from './warehouse.mapper';

export class InventoryMapper {
  static entityInfraToDomain(infra: InfraInventory): DomainInventoryEntity {
    return new DomainInventoryEntity({
      id: infra.id,
      warehouse: WarehouseMapper.entityInfraToDomain(infra.warehouse),
      product: ProductMapper.entityInfraToDomain(infra.product),
      quantity: infra.quantity,
      batch: infra.batch,
      expirationDate: infra.expirationDate,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(domain: DomainInventoryEntity): InfraInventory {
    const infra = new InfraInventory();
    infra.id = domain.getId();
    infra.warehouse = WarehouseMapper.entityDomainToInfra(
      domain.getWarehouse(),
    );
    infra.product = ProductMapper.entityDomainToInfra(domain.getProduct());
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
