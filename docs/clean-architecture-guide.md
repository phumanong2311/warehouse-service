# Clean Architecture Implementation Guide

## Overview

This document explains the Clean Architecture implementation in the Warehouse Service, including the architectural decisions, layer separation, and how to maintain clean boundaries between layers.

## Architecture Layers

### 1. Domain Layer (`src/domain/`)
**Purpose**: Contains business logic and domain entities
**Dependencies**: None (pure business logic)

```
src/domain/warehouse/
├── entities/                    # Domain entities (business objects)
│   ├── warehouse.entity.ts
│   ├── inventory.entity.ts
│   ├── rack.entity.ts
│   └── unit.entity.ts
├── interfaces/                  # Domain interfaces
│   └── pagination.interface.ts
├── services/                    # Domain services (business logic)
│   ├── warehouse.service.ts
│   ├── inventory.service.ts
│   └── unit.service.ts
├── interface-repositories/      # Repository contracts
│   ├── warehouse.interface.repository.ts
│   ├── inventory.interface.repository.ts
│   └── rack.interface.repository.ts
└── mappers/                     # Domain ↔ Infrastructure mapping
    ├── warehouse.mapper.ts
    ├── inventory.mapper.ts
    └── rack.mapper.ts
```

**Key Principles**:
- No framework dependencies (no `@nestjs`, `@mikro-orm`, etc.)
- No DTOs or HTTP concerns
- Pure business logic and domain rules
- Framework-agnostic and testable

### 2. Application Layer (`src/application/`)
**Purpose**: Orchestrates domain services and implements use cases
**Dependencies**: Domain layer only

```
src/application/warehouse/
├── use-cases/                   # Application use cases
│   ├── find-warehouse.use-case.ts
│   ├── manage-warehouse.use-case.ts
│   └── inventory-management.use-case.ts
├── services/                    # Application services
│   └── warehouse-application.service.ts
└── interface-repositories/      # Application interfaces
    └── warehouse-application.interface.repository.ts
```

**Key Principles**:
- Can use framework decorators (`@Injectable`)
- Orchestrates domain services
- Implements application-specific use cases
- Coordinates between multiple domain services

### 3. Infrastructure Layer (`src/infra/`)
**Purpose**: Handles external concerns (HTTP, database, etc.)
**Dependencies**: Application and Domain layers

```
src/infra/
├── http/                        # HTTP infrastructure
│   ├── controllers/             # HTTP controllers
│   ├── dtos/                    # Data Transfer Objects
│   ├── mappers/                 # DTO ↔ Domain mapping
│   └── modules/                 # NestJS modules
├── postgresql/                  # Database infrastructure
│   ├── entities/                # Database entities
│   ├── repositories/            # Repository implementations
│   └── mikro/                   # MikroORM configuration
└── config/                      # Configuration
```

**Key Principles**:
- Handles all external concerns
- Contains DTOs with validation
- Implements repository interfaces
- Manages framework-specific code

## Data Flow

```
HTTP Request (DTO)
    ↓
Controller (maps DTO → Domain Entity)
    ↓
Use Case (Domain Entity)
    ↓
Domain Service (Domain Entity)
    ↓
Repository Interface (Domain Entity)
    ↓
Repository Implementation (Domain Entity → Infrastructure Entity)
```

## Key Architectural Fixes

### 1. Removed NestJS Decorators from Domain Layer

**Before**:
```typescript
// ❌ Domain service with framework dependencies
@Injectable()
export class WarehouseService {
  constructor(
    @Inject('IWarehouseRepository')
    private warehouseRepository: IWarehouseRepository,
  ) {}
}
```

**After**:
```typescript
// ✅ Pure domain service
export class WarehouseService {
  constructor(
    private warehouseRepository: IWarehouseRepository,
  ) {}
}
```

### 2. Removed DTOs from Domain Layer

**Before**:
```typescript
// ❌ Domain service using DTOs
import { PaginationWarehouseDto } from '../dtos';

async findWithPagination(query: PaginationWarehouseDto) {
  // ...
}
```

**After**:
```typescript
// ✅ Domain service using domain interfaces
import { PaginationQuery } from '../interfaces/pagination.interface';

async findWithPagination(query: PaginationQuery) {
  // ...
}
```

### 3. Proper DTO Mapping in Infrastructure Layer

**Before**:
```typescript
// ❌ Controller passing DTO directly to domain
@Post()
async createWarehouse(@Body() dto: CreateWarehouseDto) {
  return await this.useCase.create(dto); // DTO in domain layer
}
```

**After**:
```typescript
// ✅ Controller mapping DTO to domain entity
@Post()
async createWarehouse(@Body() dto: CreateWarehouseDto) {
  const entity = WarehouseDtoMapper.createDtoToDomainEntity(dto);
  return await this.useCase.create(entity);
}
```

## Dependency Injection Setup

The infrastructure layer handles all dependency injection:

```typescript
// src/infra/http/modules/warehouse.module.ts
@Module({
  providers: [
    // Repository Implementations
    {
      provide: 'IWarehouseRepository',
      useClass: WarehouseRepository,
    },
    
    // Domain Services (no decorators)
    {
      provide: WarehouseService,
      useFactory: (warehouseRepository) => {
        return new WarehouseService(warehouseRepository);
      },
      inject: ['IWarehouseRepository'],
    },
    
    // Application Services
    {
      provide: WarehouseApplicationService,
      useFactory: (warehouseService, inventoryService, unitService) => {
        return new WarehouseApplicationService(warehouseService, inventoryService, unitService);
      },
      inject: [WarehouseService, InventoryService, UnitService],
    },
  ],
})
export class WarehouseModule {}
```

## DTO Mapping

### Warehouse DTO Mapper

```typescript
// src/infra/http/mappers/warehouse-dto.mapper.ts
export class WarehouseDtoMapper {
  static createDtoToDomainEntity(dto: CreateWarehouseDto): DomainWarehouseEntity {
    return new DomainWarehouseEntity({
      id: uuidv4(),
      name: dto.name,
      code: dto.code,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      description: dto.description,
    });
  }

  static updateDtoToPartialDomainEntity(dto: UpdateWarehouseDto): Partial<DomainWarehouseEntity> {
    const partial: Partial<DomainWarehouseEntity> = {};
    
    if (dto.name !== undefined) partial.name = dto.name;
    if (dto.code !== undefined) partial.code = dto.code;
    // ... other fields
    
    return partial;
  }
}
```

## Domain Interfaces

### Pagination Interface

```typescript
// src/domain/warehouse/interfaces/pagination.interface.ts
export interface PaginationQuery {
  limit?: number;
  page?: number;
  name?: string;
  code?: string;
  // ... other filter fields
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Best Practices

### 1. Domain Layer Rules
- ✅ Use domain entities and interfaces
- ✅ Implement business logic and validation
- ✅ Keep framework-agnostic
- ❌ No DTOs, decorators, or framework imports

### 2. Application Layer Rules
- ✅ Orchestrate domain services
- ✅ Implement use cases
- ✅ Can use framework decorators
- ❌ No direct database access

### 3. Infrastructure Layer Rules
- ✅ Handle external concerns (HTTP, DB)
- ✅ Implement repository interfaces
- ✅ Map DTOs to domain entities
- ✅ Manage framework configuration

### 4. Testing Strategy
- **Domain Layer**: Unit tests without framework setup
- **Application Layer**: Integration tests with mocked repositories
- **Infrastructure Layer**: End-to-end tests with real database

## Migration from Product Service

The warehouse service has been cleaned up to remove all product-related dependencies:

### Removed Components
- Product, Category, Variant entities and repositories
- VariantService dependencies
- Product-related DTOs and mappers
- MikroORM entity configurations for products

### Updated Components
- Inventory entities now use `variantId: string` instead of `DomainVariantEntity`
- Rack entities store `variantIds: string[]` instead of variant entities
- All services removed variant validation (handled by product service)

## API Endpoints

### Warehouse Management
- `GET /warehouse` - List warehouses with pagination
- `GET /warehouse/all` - List all warehouses
- `GET /warehouse/:id` - Get warehouse by ID
- `POST /warehouse` - Create warehouse
- `PUT /warehouse/:id` - Update warehouse
- `DELETE /warehouse/:id` - Delete warehouse

### Inventory Management
- `GET /warehouse/inventory` - List inventory with pagination
- `GET /warehouse/inventory/:id` - Get inventory by ID
- `GET /warehouse/inventory/variant/:variantId` - Get inventory by variant
- `POST /warehouse/inventory` - Create inventory
- `PUT /warehouse/inventory/:id` - Update inventory
- `DELETE /warehouse/inventory/:id` - Delete inventory

### Inventory Operations
- `POST /warehouse/inventory/check-in` - Check in inventory
- `POST /warehouse/inventory/check-out` - Check out inventory
- `POST /warehouse/inventory/transfer` - Transfer inventory
- `POST /warehouse/inventory/adjust` - Adjust inventory
- `POST /warehouse/inventory/write-off` - Write off inventory
- `POST /warehouse/inventory/physical-count` - Physical count adjustment

## Conclusion

This Clean Architecture implementation ensures:
- **Maintainability**: Clear separation of concerns
- **Testability**: Domain logic can be tested independently
- **Flexibility**: Easy to change frameworks or add new features
- **Independence**: Domain layer is framework-agnostic
- **Scalability**: Easy to add new layers or modify existing ones

The architecture follows the Dependency Rule: dependencies point inward, with the domain layer at the center, independent of all external concerns.
