# Description Field Fix

## Problem
There was a mismatch between the `CreateWarehouseDto` and the `DomainWarehouseEntity`:
- The DTO had a `description` field
- The domain entity was missing the `description` field

## Solution
Added the `description` field to all layers to maintain consistency:

### 1. Domain Layer Updates

#### Domain Entity (`src/domain/warehouse/entities/warehouse.entity.ts`)
```typescript
export class DomainWarehouseEntity extends DomainBaseEntity {
  private description?: string; // Added field
  
  constructor(params: {
    // ... other fields
    description?: string; // Added to constructor
  }) {
    // ... initialization
    this.description = params.description; // Added assignment
  }
  
  setDescription(description: string): void { // Added setter
    this.description = description;
  }
  
  getDescription(): string | undefined { // Added getter
    return this.description;
  }
}
```

#### Domain Mapper (`src/domain/warehouse/mapper/warehouse.mapper.ts`)
```typescript
export class WarehouseMapper {
  static entityInfraToDomain(infra: InfraWarehouse): DomainWarehouseEntity {
    return new DomainWarehouseEntity({
      // ... other fields
      description: infra.description, // Added mapping
    });
  }
  
  static entityDomainToInfra(domain: Partial<DomainWarehouseEntity>): InfraWarehouse {
    // ... other mappings
    if (domain.getDescription) infra.description = domain.getDescription(); // Added mapping
  }
}
```

### 2. Infrastructure Layer Updates

#### Database Entity (`src/infra/postgresql/entities/warehouse.entity.ts`)
```typescript
@Entity({ tableName: 'warehouse' })
export class Warehouse extends InfraBaseEntity {
  // ... other fields
  
  @Property({ type: 'string', nullable: true })
  description?: string; // Added field
}
```

#### DTO Mapper (`src/infra/http/mappers/warehouse-dto.mapper.ts`)
```typescript
export class WarehouseDtoMapper {
  static createDtoToDomainEntity(dto: CreateWarehouseDto): DomainWarehouseEntity {
    return new DomainWarehouseEntity({
      // ... other fields
      description: dto.description, // Added mapping
    });
  }
  
  static updateDtoToPartialDomainEntity(dto: UpdateWarehouseDto): Partial<DomainWarehouseEntity> {
    const partial: any = {};
    // ... other fields
    if (dto.description !== undefined) partial.description = dto.description; // Added mapping
    return partial;
  }
}
```

### 3. Database Migration

Created and applied migration to add the `description` column:

```sql
-- Migration20250213050000.ts
ALTER TABLE "warehouse" ADD COLUMN "description" varchar(255) null;
```

## Result

Now the `description` field is properly handled across all layers:

1. **DTO Layer**: `CreateWarehouseDto` and `UpdateWarehouseDto` have `description` field
2. **Domain Layer**: `DomainWarehouseEntity` has `description` field with getter/setter
3. **Infrastructure Layer**: Database entity has `description` column
4. **Mappers**: All mappers properly handle the `description` field
5. **Database**: Migration applied successfully

## API Usage

### Create Warehouse with Description
```json
POST /warehouse
{
  "name": "Main Warehouse",
  "code": "WH001",
  "phone": "+1234567890",
  "email": "warehouse@example.com",
  "address": "123 Main St",
  "description": "Primary warehouse for main operations"
}
```

### Update Warehouse Description
```json
PUT /warehouse/:id
{
  "description": "Updated description for the warehouse"
}
```

## Benefits

1. **Consistency**: All layers now have the same field structure
2. **Flexibility**: Description field is optional, allowing for detailed warehouse information
3. **Clean Architecture**: Proper separation of concerns maintained
4. **Database Integrity**: Migration ensures database schema matches entity structure

The fix ensures that the warehouse service can now properly handle description information across all architectural layers while maintaining Clean Architecture principles.
