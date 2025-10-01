import { DomainBaseEntity } from '@share/domain/entities';
import { v4 as uuidv4 } from 'uuid';

export class DomainUnitEntity extends DomainBaseEntity {
  private name!: string;
  private symbol!: string; // Ký hiệu đơn vị đo (ví dụ: kg, m, L, pcs)
  private description?: string;
  private conversionRate?: number; // Hệ số quy đổi (nếu có, ví dụ: 1 thùng = 10 kg)

  constructor(params: {
    id?: string;
    name: string;
    symbol: string;
    createdBy?: string;
    updatedBy?: string;
    description?: string;
    conversionRate?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super({
      id: params.id ?? uuidv4(),
      createdBy: params.createdBy,
      updatedBy: params.updatedBy,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this.name = params.name;
    this.symbol = params.symbol;
    this.description = params.description;
    this.conversionRate = params.conversionRate;
  }
  setDescription(description: string): void {
    this.description = description;
  }

  setConversionRate(conversionRate: number): void {
    this.conversionRate = conversionRate;
  }

  setSymbol(symbol: string): void {
    this.symbol = symbol;
  }

  getName(): string {
    return this.name;
  }

  getSymbol(): string {
    return this.symbol;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getConversionRate(): number | undefined {
    return this.conversionRate;
  }
}
