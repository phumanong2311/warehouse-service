import { DomainUnitEntity } from '../../../domain/warehouse/entities';
import { IUnitRepository } from '../../../domain/warehouse/interface-repositories/unit.interface.repository';

export interface UnitManagementUseCase {
  findById(id: string): Promise<DomainUnitEntity>;
  findAll(): Promise<DomainUnitEntity[]>;
  findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainUnitEntity[]; total: number }>;
  create(unit: DomainUnitEntity): Promise<DomainUnitEntity>;
  update(id: string, unit: Partial<DomainUnitEntity>): Promise<DomainUnitEntity>;
  delete(id: string): Promise<void>;
}

export class UnitManagementUseCaseImpl implements UnitManagementUseCase {
  constructor(private readonly unitRepository: IUnitRepository) {}

  async findById(id: string): Promise<DomainUnitEntity> {
    return await this.unitRepository.findByIdUnit(id);
  }

  async findAll(): Promise<DomainUnitEntity[]> {
    return await this.unitRepository.findAllUnits();
  }

  async findWithPagination(query: {
    limit?: number;
    page?: number;
    filter?: Record<string, any>;
  }): Promise<{ data: DomainUnitEntity[]; total: number }> {
    return this.unitRepository.findWithPagination(query);
  }

  async create(unit: DomainUnitEntity): Promise<DomainUnitEntity> {
    // Validate required fields
    if (!unit.getName() || unit.getName().trim().length === 0) {
      throw new Error('Unit name is required');
    }

    if (!unit.getSymbol() || unit.getSymbol().trim().length === 0) {
      throw new Error('Unit symbol is required');
    }

    // TODO: Validate unit name/symbol uniqueness
    // This would require a new repository method

    return await this.unitRepository.saveAndReturnDomain(unit);
  }

  async update(
    id: string,
    unit: Partial<DomainUnitEntity>,
  ): Promise<DomainUnitEntity> {
    // Check if unit exists
    const existingUnit = await this.unitRepository.findByIdUnit(id);
    if (!existingUnit) {
      throw new Error(`Unit with id ${id} not found`);
    }

    // Validate name if provided
    if (unit.getName && (!unit.getName() || unit.getName().trim().length === 0)) {
      throw new Error('Unit name is required');
    }

    // Validate symbol if provided
    if (unit.getSymbol && (!unit.getSymbol() || unit.getSymbol().trim().length === 0)) {
      throw new Error('Unit symbol is required');
    }

    return await this.unitRepository.updateAndReturnDomain(id, unit);
  }

  async delete(id: string): Promise<void> {
    // Check if unit exists
    const existingUnit = await this.unitRepository.findByIdUnit(id);
    if (!existingUnit) {
      throw new Error(`Unit with id ${id} not found`);
    }

    // TODO: Add business rule to check if unit is used in inventory
    // This would require checking inventory repository

    return await this.unitRepository.deleteUnit(id);
  }
}
