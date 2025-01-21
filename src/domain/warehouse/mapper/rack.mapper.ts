import { VariantMapper } from '@domain/product/mapper';
import { Rack as InfraRack } from '@infra/postgresql/entities';
import { DomainRackEntity } from '../entities';
import { WarehouseMapper } from './warehouse.mapper';

export class RackMapper {
  static entityInfraToDomain(infra: InfraRack): DomainRackEntity {
    return new DomainRackEntity({
      id: infra.id,
      name: infra.name,
      warehouse: WarehouseMapper.entityInfraToDomain(infra.warehouse),
      variants: infra.variants.map((item) =>
        VariantMapper.entityInfraToDomain(item),
      ),
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(domain: DomainRackEntity): InfraRack {
    const infra = new InfraRack();
    infra.id = domain.getId();
    infra.name = domain.getName();
    infra.warehouse = WarehouseMapper.entityDomainToInfra(
      domain.getWarehouse(),
    );
    infra.variants = domain
      .getVariants()
      .map((item) => VariantMapper.entityDomainToInfra(item));
    return infra;
  }
}
