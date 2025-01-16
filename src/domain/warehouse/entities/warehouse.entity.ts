import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { DomainRackEntity } from './rack.entity';

export class DomainWarehouseEntity extends DomainBaseEntity {
  private code!: string; //unique
  private phone!: string;
  private name!: string;
  private email!: string;
  private logo!: string;
  private address!: string;
  private racks: DomainRackEntity[];
  private registrationExpirationDate: Date;
  constructor(params: {
    id?: string;
    createdBy?: string;
    updatedBy?: string;
    code?: string;
    phone?: string;
    name?: string;
    email?: string;
    logo?: string;
    address?: string;
    racks: DomainRackEntity[];
    createdAt?: Date;
    updatedAt?: Date;
    registrationExpirationDate?: Date;
  }) {
    super({
      id: params.id ?? uuidv4(),
      createdBy: params.createdBy,
      updatedBy: params.updatedBy,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.code = params.code;
    this.phone = params.phone;
    this.name = params.name;
    this.email = params.email;
    this.logo = params.logo;
    this.address = params.address;
    this.racks = params.racks;
    this.registrationExpirationDate = params.registrationExpirationDate;
  }
  setCode(code: string): void {
    this.code = code;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setName(name: string): void {
    this.name = name;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setLogo(logo: string): void {
    this.logo = logo;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setRacks(racks: DomainRackEntity[]): void {
    this.racks = racks;
  }

  setRegistrationExpirationDate(registrationExpirationDate: Date): void {
    this.registrationExpirationDate = registrationExpirationDate;
  }

  getCode(): string {
    return this.code;
  }

  getPhone(): string {
    return this.phone;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getLogo(): string {
    return this.logo;
  }

  getAddress(): string {
    return this.address;
  }

  getRacks(): DomainRackEntity[] {
    return this.racks;
  }

  getRegistrationExpirationDate(): Date {
    return this.registrationExpirationDate;
  }
}
