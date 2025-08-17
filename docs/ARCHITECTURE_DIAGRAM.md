# Architecture Diagram

## Hexagonal Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Controllers   │  │   Middleware    │  │   Guards     │ │
│  │                 │  │                 │  │              │ │
│  │ - HTTP Endpoints│  │ - Auth          │  │ - Validation │ │
│  │ - Request/Resp  │  │ - Logging       │  │ - Permissions│ │
│  │ - Validation    │  │ - Rate Limiting │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼ (depends on)
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Use Cases      │  │  DTOs           │  │  Interfaces  │ │
│  │                 │  │                 │  │              │ │
│  │ - Business Flow │  │ - Input/Output  │  │ - Contracts  │ │
│  │ - Orchestration │  │ - Validation    │  │ - Abstractions│ │
│  │ - Application   │  │ - Serialization │  │              │ │
│  │   Services      │  │                 │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼ (depends on)
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Entities      │  │   Value Objects │  │  Interfaces  │ │
│  │                 │  │                 │  │              │ │
│  │ - Business Logic│  │ - Immutable     │  │ - Repository │ │
│  │ - Business Rules│  │ - Validation    │  │ - Services   │ │
│  │ - Domain Events │  │ - Domain Logic  │  │ - Contracts  │ │
│  │ - Aggregates    │  │                 │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                ▲
                                │ (implements)
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Repositories   │  │    Mappers      │  │   External   │ │
│  │                 │  │                 │  │   Services   │ │
│  │ - Database      │  │ - Domain ↔ Infra│  │ - APIs       │ │
│  │ - ORM/Query     │  │ - Data Transform│  │ - File System│ │
│  │ - Caching       │  │ - Serialization │  │ - Message    │ │
│  │ - External APIs │  │                 │  │   Queues     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Dependency Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Presentation│───▶│ Application │───▶│   Domain    │
│   Layer     │    │   Layer     │    │   Layer     │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   ▲
       │                   │                   │
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │Infrastructure│
                    │   Layer     │
                    └─────────────┘
```

## Module Structure

```
┌─────────────────────────────────────────────────────────────┐
│                 PRESENTATION MODULE                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  WarehouseControllerModule                              │ │
│  │  ┌─────────────────┐  ┌─────────────────┐              │ │
│  │  │   Controllers   │  │   Providers     │              │ │
│  │  │                 │  │                 │              │ │
│  │  │ - WarehouseCtrl │  │ - IWarehouseRepo│              │ │
│  │  │ - ProductCtrl   │  │ - IProductRepo  │              │ │
│  │  └─────────────────┘  └─────────────────┘              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼ (imports)
┌─────────────────────────────────────────────────────────────┐
│                 APPLICATION MODULE                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  WarehouseApplicationModule                             │ │
│  │  ┌─────────────────┐  ┌─────────────────┐              │ │
│  │  │   Services      │  │   Providers     │              │ │
│  │  │                 │  │                 │              │ │
│  │  │ - WarehouseApp  │  │ - IWarehouseSvc │              │ │
│  │  │   Service       │  │ - IWarehouseRepo│              │ │
│  │  └─────────────────┘  └─────────────────┘              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Example

```
1. HTTP Request
   ┌─────────────┐
   │ GET /warehouse/123 │
   └─────────────┘
           │
           ▼
2. Controller
   ┌─────────────┐
   │ WarehouseController.findWarehouseById() │
   └─────────────┘
           │
           ▼
3. Application Service
   ┌─────────────┐
   │ WarehouseApplicationService.findByIdWarehouse() │
   └─────────────┘
           │
           ▼
4. Repository
   ┌─────────────┐
   │ WarehouseRepository.findByIdWarehouse() │
   └─────────────┘
           │
           ▼
5. Database
   ┌─────────────┐
   │ SELECT * FROM warehouse WHERE id = '123' │
   └─────────────┘
           │
           ▼
6. Mapper
   ┌─────────────┐
   │ WarehouseMapper.entityInfraToDomain() │
   └─────────────┘
           │
           ▼
7. Response
   ┌─────────────┐
   │ DomainWarehouseEntity │
   └─────────────┘
```

## File Structure Visualization

```
src/
├── domain/                           # 🎯 Core Business Logic
│   └── warehouse/
│       ├── entities/
│       │   ├── warehouse.entity.ts   # Domain Entity
│       │   ├── rack.entity.ts        # Domain Entity
│       │   └── inventory.entity.ts   # Domain Entity
│       ├── interface-repositories/
│       │   └── warehouse.interface.repository.ts  # Repository Contract
│       └── services/                 # Domain Services (if needed)
│
├── application/                      # 🔄 Use Cases & Orchestration
│   └── warehouse/
│       ├── warehouse-application.module.ts  # Application Module
│       ├── services/
│       │   └── warehouse-application.service.ts  # Use Cases
│       ├── interfaces/
│       │   └── warehouse.service.ts  # Service Contract
│       ├── dtos/
│       │   └── pagination-warehouse.dto.ts  # Data Transfer Objects
│       └── index.ts                  # Export Barrel
│
├── infrastructure/                   # 🗄️ External Concerns
│   └── postgresql/
│       ├── repositories/
│       │   ├── warehouse.repository.ts      # Repository Implementation
│       │   ├── inventory.repository.ts      # Repository Implementation
│       │   └── unit.repository.ts           # Repository Implementation
│       ├── mappers/
│       │   ├── warehouse.mapper.ts          # Data Mapper
│       │   ├── inventory.mapper.ts          # Data Mapper
│       │   ├── unit.mapper.ts               # Data Mapper
│       │   └── rack.mapper.ts               # Data Mapper
│       ├── entities/
│       │   ├── warehouse.entity.ts          # Database Entity
│       │   ├── inventory.entity.ts          # Database Entity
│       │   └── unit.entity.ts               # Database Entity
│       └── config/
│           └── mikro-orm.config.ts          # Database Config
│
└── presentation/                     # 🌐 HTTP & API Layer
    └── warehouse/
        ├── controllers/
        │   ├── warehouse.controller.ts       # HTTP Controller
        │   ├── warehouse-controller.module.ts  # Presentation Module
        │   └── index.ts                      # Export Barrel
        └── index.ts                          # Export Barrel
```

## Key Principles

### 1. Dependency Rule
- **Dependencies point inward**
- **Domain layer has no dependencies**
- **External layers depend on internal layers through interfaces**

### 2. Separation of Concerns
- **Domain**: Pure business logic
- **Application**: Use cases and orchestration
- **Infrastructure**: External concerns (database, APIs)
- **Presentation**: HTTP and user interface concerns

### 3. Interface Segregation
- **Repository interfaces** in domain layer
- **Service interfaces** in application layer
- **Implementation** in infrastructure/presentation layers

### 4. Dependency Injection
- **String tokens** for loose coupling
- **Modules** for dependency management
- **Interface-based** programming 
