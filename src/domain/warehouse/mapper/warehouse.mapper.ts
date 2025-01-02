import { Warehouse as InfraWarehouse } from '@infra/postgresql/entities';
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
      racks: infra.racks.map((item) => RackMapper.entityInfraToDomain(item)),
      createdBy: infra.createdBy,
      updatedBy: infra.updatedBy,
      createdAt: infra.createdAt,
      updatedAt: infra.updatedAt,
    });
  }
  static entityDomainToInfra(domain: DomainWarehouseEntity): InfraWarehouse {
    const infra = new InfraWarehouse();
    infra.id = domain.getId();
    infra.name = domain.getName();
    infra.code = domain.getCode();
    infra.phone = domain.getPhone();
    infra.email = domain.getEmail();
    infra.logo = domain.getLogo();
    infra.address = domain.getAddress();
    infra.racks = domain
      .getRacks()
      .map((item) => RackMapper.entityDomainToInfra(item));
    return infra;
  }
}
