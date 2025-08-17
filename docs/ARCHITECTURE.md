# Warehouse Service - Hexagonal Architecture Documentation

## 📋 Tổng quan

Dự án Warehouse Service được xây dựng theo kiến trúc **Hexagonal Architecture** (Clean Architecture) với NestJS framework. Kiến trúc này giúp tách biệt business logic khỏi external concerns và dễ dàng test, maintain.

## 🏗️ Cấu trúc thư mục

```
src/
├── domain/                    # Core business logic (innermost)
│   └── warehouse/
│       ├── entities/          # Domain entities
│       ├── interface-repositories/ # Repository interfaces
│       └── services/          # Domain services (nếu cần)
├── application/               # Use cases & application logic
│   └── warehouse/
│       ├── warehouse-application.module.ts  # Module quản lý DI
│       ├── services/          # Application services (use cases)
│       ├── interfaces/        # Service interfaces
│       ├── dtos/              # Request/Response DTOs
│       └── index.ts           # Export barrel
├── infrastructure/            # External concerns
│   └── postgresql/
│       ├── repositories/      # Repository implementations
│       ├── mappers/           # Data mappers
│       └── entities/          # Database entities
└── presentation/              # Controllers & HTTP concerns (outermost)
    └── warehouse/
        ├── controllers/       # HTTP controllers
        │   ├── warehouse.controller.ts
        │   ├── warehouse-controller.module.ts  # Module quản lý DI
        │   └── index.ts       # Export barrel
        └── index.ts           # Export barrel
```

## 🔄 Dependency Flow

### Dependency Rule
- **Dependencies chỉ được phép hướng vào trong** (towards the center)
- **Domain layer không phụ thuộc vào bất kỳ layer nào khác**
- **Infrastructure và Presentation phụ thuộc vào Domain thông qua interfaces**

### Flow Diagram
```
Presentation Layer
       ↓ (depends on)
Application Layer
       ↓ (depends on)
Domain Layer
       ↑ (depends on)
Infrastructure Layer
```

## 📦 Chi tiết từng Layer

### 1. Domain Layer (Core Business Logic)

**Vị trí**: `src/domain/`

**Mục đích**: Chứa business logic thuần túy, không phụ thuộc vào framework hay external concerns.

**Thành phần**:
- **Entities**: Business objects với behavior
- **Interface Repositories**: Định nghĩa contract cho data access
- **Domain Services**: Business logic phức tạp

**Ví dụ**:
```typescript
// Domain Entity
export class DomainWarehouseEntity extends DomainBaseEntity {
  private code!: string;
  private name!: string;
  
  constructor(params: { code: string; name: string }) {
    super();
    this.code = params.code;
    this.name = params.name;
  }
  
  getCode(): string { return this.code; }
  getName(): string { return this.name; }
}

// Repository Interface
export interface IWarehouseRepository {
  findByIdWarehouse(id: string): Promise<DomainWarehouseEntity>;
  saveAndReturnDomain(warehouse: DomainWarehouseEntity): Promise<DomainWarehouseEntity>;
}
```

### 2. Application Layer (Use Cases)

**Vị trí**: `src/application/`

**Mục đích**: Chứa use cases, orchestration logic, và application services.

**Thành phần**:
- **Application Services**: Implement use cases
- **DTOs**: Data Transfer Objects cho request/response
- **Interfaces**: Service contracts
- **Modules**: Dependency injection management

**Ví dụ**:
```typescript
// Application Service
@Injectable()
export class WarehouseApplicationService implements IWarehouseService {
  constructor(
    @Inject('IWarehouseRepository')
    private warehouseRepository: IWarehouseRepository,
  ) {}

  async findByIdWarehouse(warehouseId: string): Promise<DomainWarehouseEntity> {
    return await this.warehouseRepository.findByIdWarehouse(warehouseId);
  }
}

// Application Module
@Module({
  providers: [
    {
      provide: 'IWarehouseService',
      useClass: WarehouseApplicationService,
    },
  ],
  exports: ['IWarehouseService'],
})
export class WarehouseApplicationModule {}
```

### 3. Infrastructure Layer (External Concerns)

**Vị trí**: `src/infrastructure/`

**Mục đích**: Implement các external concerns như database, external APIs, file system.

**Thành phần**:
- **Repositories**: Implement repository interfaces từ domain
- **Mappers**: Chuyển đổi giữa domain entities và infrastructure entities
- **Entities**: Database entities (MikroORM)
- **Config**: Database configuration

**Ví dụ**:
```typescript
// Repository Implementation
@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
  async findByIdWarehouse(id: string): Promise<DomainWarehouseEntity> {
    const data = await this.findOne({ id });
    return WarehouseMapper.entityInfraToDomain(data);
  }
}

// Mapper
export class WarehouseMapper {
  static entityInfraToDomain(infraEntity: Warehouse): DomainWarehouseEntity {
    return new DomainWarehouseEntity({
      id: infraEntity.id,
      code: infraEntity.code,
      name: infraEntity.name,
    });
  }
}
```

### 4. Presentation Layer (HTTP Controllers)

**Vị trí**: `src/presentation/`

**Mục đích**: Xử lý HTTP requests, validation, và response formatting.

**Thành phần**:
- **Controllers**: HTTP endpoints
- **Modules**: Dependency injection cho controllers
- **Validation**: Request validation

**Ví dụ**:
```typescript
// Controller
@Controller()
export class WarehouseController {
  constructor(
    @Inject('IWarehouseService')
    private readonly warehouseService: IWarehouseService,
  ) {}

  @Get(':id')
  async findWarehouseById(@Param('id') id: string) {
    return await this.warehouseService.findByIdWarehouse(id);
  }
}

// Presentation Module
@Module({
  imports: [WarehouseApplicationModule],
  controllers: [WarehouseController],
  providers: [
    {
      provide: 'IWarehouseRepository',
      useClass: WarehouseRepository,
    },
  ],
})
export class WarehouseControllerModule {}
```

## 🔧 Dependency Injection

### Token Naming Convention
- Repository interfaces: `'I[Entity]Repository'`
- Service interfaces: `'I[Entity]Service'`

### Module Structure
```typescript
// Application Module
@Module({
  providers: [
    { provide: 'IWarehouseRepository', useClass: null }, // Provided by Infrastructure
    { provide: 'IWarehouseService', useClass: WarehouseApplicationService },
  ],
  exports: ['IWarehouseService'],
})

// Presentation Module
@Module({
  imports: [WarehouseApplicationModule],
  controllers: [WarehouseController],
  providers: [
    { provide: 'IWarehouseRepository', useClass: WarehouseRepository },
  ],
})
```

## 🧪 Testing Strategy

### Unit Tests
- **Domain**: Test business logic thuần túy
- **Application**: Test use cases với mocked repositories
- **Infrastructure**: Test repository implementations với test database

### Integration Tests
- **End-to-End**: Test toàn bộ flow từ controller đến database
- **Repository Tests**: Test với real database

### Test Structure
```
test/
├── unit/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── integration/
│   ├── repositories/
│   └── controllers/
└── e2e/
```

## 📝 Best Practices

### 1. Domain Layer
- ✅ Entities chỉ chứa business logic
- ✅ Sử dụng private fields với getter/setter
- ✅ Không import từ external layers
- ✅ Repository interfaces định nghĩa trong domain

### 2. Application Layer
- ✅ Use cases orchestrate domain entities
- ✅ DTOs cho input/output validation
- ✅ Application services implement service interfaces
- ✅ Modules quản lý dependency injection

### 3. Infrastructure Layer
- ✅ Repositories implement domain interfaces
- ✅ Mappers chuyển đổi giữa domain và infrastructure entities
- ✅ Database entities chỉ chứa data structure
- ✅ Không chứa business logic

### 4. Presentation Layer
- ✅ Controllers chỉ xử lý HTTP concerns
- ✅ Validation sử dụng DTOs
- ✅ Dependency injection thông qua modules
- ✅ Không chứa business logic

## 🚀 Development Workflow

### 1. Thêm Entity mới
1. Tạo domain entity trong `src/domain/[entity]/entities/`
2. Tạo repository interface trong `src/domain/[entity]/interface-repositories/`
3. Tạo application service trong `src/application/[entity]/services/`
4. Tạo infrastructure repository trong `src/infrastructure/postgresql/repositories/`
5. Tạo mapper trong `src/infrastructure/postgresql/mappers/`
6. Tạo controller trong `src/presentation/[entity]/controllers/`
7. Cập nhật modules và exports

### 2. Thêm Use Case mới
1. Định nghĩa interface trong application layer
2. Implement service trong application layer
3. Cập nhật application module
4. Sử dụng trong presentation layer

### 3. Thay đổi Database
1. Cập nhật infrastructure entities
2. Cập nhật mappers
3. Cập nhật repositories nếu cần
4. Chạy migrations

## 🔍 Monitoring & Logging

### Logging Strategy
- **Domain**: Business events
- **Application**: Use case execution
- **Infrastructure**: Database operations
- **Presentation**: HTTP requests/responses

### Error Handling
- **Domain**: Business exceptions
- **Application**: Use case exceptions
- **Infrastructure**: Database exceptions
- **Presentation**: HTTP error responses

## 📚 References

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [MikroORM Documentation](https://mikro-orm.io/)

---

**Lưu ý**: Document này nên được cập nhật khi có thay đổi về kiến trúc hoặc best practices mới. 
