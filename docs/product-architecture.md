# Product Architecture Documentation

## Overview

Product module được tái cấu trúc theo nguyên tắc **Hexagonal Architecture** và **Clean Architecture**, tách biệt rõ ràng các concerns và giảm thiểu dependencies giữa các layers.

## Architecture Principles

### 🏗️ Hexagonal Architecture (Ports & Adapters)
- **Domain**: Core business logic, không phụ thuộc framework
- **Application**: Use cases, orchestrate business operations
- **Infrastructure**: Framework-specific implementations (NestJS, PostgreSQL)

### 🧹 Clean Architecture
- **Dependency Rule**: Dependencies chỉ hướng vào trong (Domain → Application → Infrastructure)
- **Framework Independence**: Domain và Application layers không biết về NestJS
- **Testability**: Mỗi layer có thể test độc lập

## Directory Structure

```
src/
├── domain/product/                    # 🎯 Domain Layer
│   ├── entities/
│   │   ├── product.entity.ts         # Domain Product Entity
│   │   ├── variant.entity.ts         # Domain Variant Entity
│   │   └── index.ts                  # Export entities
│   ├── interface-repositories/
│   │   └── product.interface.repository.ts  # Repository interface
│   ├── mapper/
│   │   ├── product.mapper.ts         # Domain ↔ Infrastructure mapping
│   │   ├── variant.mapper.ts         # Variant mapping
│   │   └── index.ts                  # Export mappers
│   └── services/
│       └── product.service.ts        # Pure domain services
│
├── application/product/               # 🎯 Application Layer
│   └── use-cases/
│       ├── find-product.use-case.ts  # Find operations
│       ├── manage-product.use-case.ts # CRUD operations
│       └── index.ts                  # Export use cases
│
└── infra/                            # 🔧 Infrastructure Layer
    ├── http/
    │   ├── controllers/
    │   │   └── product.controller.ts # NestJS HTTP controller
    │   ├── dtos/
    │   │   └── product.dto.ts        # HTTP DTOs
    │   └── modules/
    │       └── product.module.ts     # NestJS module
    └── postgresql/
        ├── entities/
        │   └── product.entity.ts     # Database entity
        ├── repositories/
        │   └── product.repository.ts # Database repository
        └── seed/
            └── ProductSeeder.ts      # Database seeder
```

## Data Flow

```
HTTP Request → Controller → Use Case → Domain Service → Repository → Database
     ↑              ↑           ↑            ↑            ↑
   Infrastructure  Infrastructure Application  Domain    Infrastructure
```

## Layer Responsibilities

### 🎯 Domain Layer
**Purpose**: Core business logic, entities, and business rules

**Components**:
- **Entities**: Business objects with behavior
- **Repository Interfaces**: Contracts for data access
- **Domain Services**: Pure business logic
- **Mappers**: Convert between domain and infrastructure models

**Rules**:
- ✅ No framework dependencies
- ✅ No external libraries (except utilities)
- ✅ Pure business logic only

### 🎯 Application Layer
**Purpose**: Orchestrate business operations, implement use cases

**Components**:
- **Use Cases**: Business operation implementations
- **Application Services**: Coordinate between use cases

**Rules**:
- ✅ Depend only on Domain layer
- ✅ No framework dependencies
- ✅ Business orchestration logic

### 🔧 Infrastructure Layer
**Purpose**: Framework-specific implementations, external integrations

**Components**:
- **HTTP Controllers**: Handle HTTP requests/responses
- **DTOs**: Data validation and transformation
- **Database Entities**: ORM models
- **Repositories**: Data access implementations

**Rules**:
- ✅ Can depend on Application and Domain layers
- ✅ Framework-specific code allowed
- ✅ External integrations

## Implementation Details

### Domain Entity Example
```typescript
export class DomainProductEntity extends DomainBaseEntity {
  private name!: string;
  private sku!: string;
  private description?: string;
  // ... other properties

  constructor(params: ProductParams) {
    super(params);
    this.name = params.name;
    this.sku = params.sku;
    // ... initialization
  }

  // Business methods
  setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}
```

### Use Case Example
```typescript
export interface FindProductUseCase {
  findById(productId: string): Promise<DomainProductEntity>;
  findAll(): Promise<DomainProductEntity[]>;
  findWithPagination(query: PaginationQuery): Promise<PaginatedResult>;
}

export class FindProductUseCaseImpl implements FindProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async findById(productId: string): Promise<DomainProductEntity> {
    return await this.productRepository.findByProductId(productId);
  }
  // ... other methods
}
```

### Controller Example
```typescript
@Controller('products')
export class ProductController {
  constructor(
    private readonly findProductUseCase: FindProductUseCase,
    private readonly manageProductUseCase: ManageProductUseCase,
  ) {}

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    if (query.limit || query.page || query.filter) {
      return await this.findProductUseCase.findWithPagination(query);
    }
    return await this.findProductUseCase.findAll();
  }
  // ... other endpoints
}
```

## Benefits

### ✅ Separation of Concerns
- **Domain**: Pure business logic
- **Application**: Business orchestration
- **Infrastructure**: Technical implementation

### ✅ Framework Independence
- Domain và Application layers không phụ thuộc NestJS
- Có thể thay đổi framework mà không ảnh hưởng business logic
- Dễ dàng migrate sang framework khác

### ✅ Testability
- Mỗi layer có thể test độc lập
- Domain logic có thể test mà không cần database
- Use cases có thể test với mock repositories

### ✅ Maintainability
- Code dễ bảo trì và mở rộng
- Changes trong một layer không ảnh hưởng layers khác
- Clear dependencies và responsibilities

### ✅ Flexibility
- Dễ dàng thêm new use cases
- Có thể thay đổi database implementation
- Support multiple interfaces (HTTP, GraphQL, etc.)

## Migration Guide

### Before (Monolithic Structure)
```
src/domain/product/
├── controller/           ❌ Framework code in domain
│   └── product.controller.ts
├── services/
│   └── product.service.ts  ❌ Mixed concerns
```

### After (Clean Architecture)
```
src/
├── domain/product/       ✅ Pure domain logic
├── application/product/  ✅ Use cases
└── infra/http/          ✅ Framework-specific code
```

## Best Practices

### 🎯 Domain Layer
- Keep entities rich with behavior
- Use value objects for complex properties
- Implement business rules in domain services
- Define clear repository interfaces

### 🎯 Application Layer
- Keep use cases focused and single-purpose
- Use dependency injection for repositories
- Handle business exceptions appropriately
- Coordinate between multiple domain services

### 🔧 Infrastructure Layer
- Implement repository interfaces
- Handle framework-specific concerns
- Use DTOs for input validation
- Map between domain and infrastructure models

## Testing Strategy

### Domain Layer Tests
```typescript
describe('DomainProductEntity', () => {
  it('should validate product name', () => {
    expect(() => new DomainProductEntity({ name: '', sku: 'SKU1' }))
      .toThrow('Product name is required');
  });
});
```

### Use Case Tests
```typescript
describe('FindProductUseCase', () => {
  it('should find product by id', async () => {
    const mockRepo = createMockRepository();
    const useCase = new FindProductUseCaseImpl(mockRepo);

    const result = await useCase.findById('product-1');
    expect(result).toBeDefined();
  });
});
```

### Controller Tests
```typescript
describe('ProductController', () => {
  it('should return all products', async () => {
    const mockUseCase = createMockUseCase();
    const controller = new ProductController(mockUseCase);

    const result = await controller.findAll({});
    expect(result).toBeDefined();
  });
});
```

## Conclusion

Cấu trúc Product đã được tái cấu trúc thành công theo nguyên tắc Clean Architecture và Hexagonal Architecture. Điều này mang lại:

- **Maintainability**: Code dễ bảo trì và mở rộng
- **Testability**: Dễ dàng test từng layer
- **Flexibility**: Có thể thay đổi framework mà không ảnh hưởng business logic
- **Scalability**: Dễ dàng thêm features mới

Pattern này có thể áp dụng cho tất cả các modules khác trong hệ thống để đảm bảo consistency và maintainability.
