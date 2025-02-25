import { Warehouse as InfraWarehouse, Rack } from '@infra/postgresql/entities';
import { Collection } from '@mikro-orm/core';
import { DomainWarehouseEntity } from '../entities';
import { RackMapper } from './rack.mapper';

export class WarehouseMapper {
  static entityInfraToDomain(infra: InfraWarehouse): DomainWarehouseEntity {
    return new DomainWarehouseEntity({
      id: infra.id,
      name: infra.name,
      code: infra.code,
      phone: infra.phone,
      email: infra.email,
      logo: infra.logo,
      address: infra.address,
      racks:
        infra.racks instanceof Collection
          ? infra.racks.isInitialized()
            ? infra.racks.getItems().map(RackMapper.entityInfraToDomain)
            : []
          : [],
      registrationExpirationDate: infra.registrationExpirationDate,
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(
    domain: Partial<DomainWarehouseEntity>,
  ): InfraWarehouse {
    const infra = new InfraWarehouse();
    if (domain.getId) infra.id = domain.getId();
    if (domain.getName) infra.name = domain.getName();
    if (domain.getCode) infra.code = domain.getCode();
    if (domain.getPhone) infra.phone = domain.getPhone();
    if (domain.getEmail) infra.email = domain.getEmail();
    if (domain.getLogo) infra.logo = domain.getLogo();
    if (domain.getAddress) infra.address = domain.getAddress();
    if (domain.getRacks) {
      const rackEntities = domain
        .getRacks()
        .map((item) => RackMapper.entityDomainToInfra(item));
      infra.racks = new Collection<Rack>(infra, rackEntities, true);
    }
    if (domain.getCreatedAt) infra.createdAt = domain.getCreatedAt();
    if (domain.getUpdatedAt) infra.updatedAt = domain.getUpdatedAt();
    if (domain.getCreatedBy) infra.createdBy = domain.getCreatedBy();
    if (domain.getUpdatedBy) infra.updatedBy = domain.getUpdatedBy();
    return infra;
  }
}
