import { VariantMapper } from '@domain/product/mapper';
import { Rack as InfraRack, Variant } from '@infra/postgresql/entities';
import { DomainRackEntity } from '../entities';
import { WarehouseMapper } from './warehouse.mapper';
import { Collection } from '@mikro-orm/core';

export class RackMapper {
  static entityInfraToDomain(infra: InfraRack): DomainRackEntity {
    return new DomainRackEntity({
      id: infra.id,
      name: infra.name,
      warehouseId: infra.warehouse.id,
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
    if (domain.getId()) infra.id = domain.getId();
    if (domain.getName()) infra.name = domain.getName();
    if (domain.getWarehouse())
      infra.warehouse = { id: domain.getWarehouse() } as any;
    if (domain.getVariants())
      infra.variants = new Collection<Variant>(
        infra,
        domain
          .getVariants()
          .map((item) => VariantMapper.entityDomainToInfra(item)),
      );
    return infra;
  }
}
