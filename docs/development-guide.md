# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure database connection in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=warehouse_service
DB_USER=your_username
DB_PASSWORD=your_password
```

5. Run database migrations:
```bash
npm run migration:run
```

6. Start the development server:
```bash
npm run start:dev
```

## Project Structure

```
src/
├── domain/                      # Domain layer (business logic)
│   └── warehouse/
│       ├── entities/            # Domain entities
│       ├── interfaces/          # Domain interfaces
│       ├── services/            # Domain services
│       ├── interface-repositories/ # Repository contracts
│       └── mappers/             # Domain mappers
├── application/                 # Application layer (use cases)
│   └── warehouse/
│       ├── use-cases/           # Application use cases
│       ├── services/            # Application services
│       └── interface-repositories/ # Application interfaces
├── infra/                       # Infrastructure layer
│   ├── http/                    # HTTP infrastructure
│   │   ├── controllers/         # HTTP controllers
│   │   ├── dtos/                # Data Transfer Objects
│   │   ├── mappers/             # DTO mappers
│   │   └── modules/             # NestJS modules
│   ├── postgresql/              # Database infrastructure
│   │   ├── entities/            # Database entities
│   │   ├── repositories/        # Repository implementations
│   │   └── mikro/               # MikroORM configuration
│   └── config/                  # Configuration
├── share/                       # Shared utilities
│   ├── domain/                  # Shared domain entities
│   ├── infra/                   # Shared infrastructure
│   └── types/                   # Shared types
└── main.ts                      # Application entry point
```

## Development Workflow

### 1. Adding New Features

When adding new features, follow the Clean Architecture principles:

1. **Start with Domain Layer**:
   - Define domain entities
   - Create domain services
   - Define repository interfaces

2. **Implement Application Layer**:
   - Create use cases
   - Implement application services

3. **Build Infrastructure Layer**:
   - Create DTOs with validation
   - Implement repository classes
   - Create HTTP controllers
   - Add DTO mappers

### 2. Example: Adding a New Entity

#### Step 1: Create Domain Entity

```typescript
// src/domain/warehouse/entities/rack.entity.ts
export class DomainRackEntity extends DomainBaseEntity {
  private name!: string;
  private warehouseId!: string;
  private variantIds: string[];

  constructor(params: {
    id?: string;
    name: string;
    warehouseId: string;
    variantIds?: string[];
    // ... other fields
  }) {
    super({
      id: params.id ?? uuidv4(),
      // ... base entity fields
    });
    
    this.name = params.name;
    this.warehouseId = params.warehouseId;
    this.variantIds = params.variantIds ?? [];
  }

  // Getters and setters
  getName(): string { return this.name; }
  setName(name: string): void { this.name = name; }
  // ... other methods
}
```

#### Step 2: Create Repository Interface

```typescript
// src/domain/warehouse/interface-repositories/rack.interface.repository.ts
export interface IRackRepository {
  findById(id: string): Promise<DomainRackEntity>;
  findAll(): Promise<DomainRackEntity[]>;
  save(rack: DomainRackEntity): Promise<DomainRackEntity>;
  update(id: string, entity: DomainRackEntity): Promise<DomainRackEntity>;
  delete(id: string): Promise<void>;
}
```

#### Step 3: Create Domain Service

```typescript
// src/domain/warehouse/services/rack.service.ts
export class RackService {
  constructor(
    private rackRepository: IRackRepository,
  ) {}

  async findById(id: string): Promise<DomainRackEntity> {
    return await this.rackRepository.findById(id);
  }

  async create(rack: DomainRackEntity): Promise<DomainRackEntity> {
    // Business logic validation
    if (!rack.getName() || rack.getName().trim().length === 0) {
      throw new Error('Rack name is required');
    }

    return await this.rackRepository.save(rack);
  }
}
```

#### Step 4: Create Use Case

```typescript
// src/application/warehouse/use-cases/rack-management.use-case.ts
export interface RackManagementUseCase {
  create(rack: DomainRackEntity): Promise<DomainRackEntity>;
  update(id: string, rack: Partial<DomainRackEntity>): Promise<DomainRackEntity>;
  delete(id: string): Promise<void>;
}

export class RackManagementUseCaseImpl implements RackManagementUseCase {
  constructor(private readonly rackRepository: IRackRepository) {}

  async create(rack: DomainRackEntity): Promise<DomainRackEntity> {
    // Application logic
    return await this.rackRepository.save(rack);
  }
}
```

#### Step 5: Create Infrastructure Entity

```typescript
// src/infra/postgresql/entities/rack.entity.ts
@Entity({ tableName: 'rack' })
export class Rack extends InfraBaseEntity {
  @Property()
  name!: string;

  @ManyToOne(() => Warehouse, { nullable: false })
  warehouse!: Warehouse;

  @Property({ type: 'json', nullable: true })
  variantIds?: string[];
}
```

#### Step 6: Create Repository Implementation

```typescript
// src/infra/postgresql/repositories/rack.repository.ts
@Injectable()
export class RackRepository extends BaseRepository<Rack> implements IRackRepository {
  constructor(em: SqlEntityManager) {
    super(em, Rack);
  }

  async findById(id: string): Promise<DomainRackEntity> {
    const data = await this.findOne({ id });
    return RackMapper.entityInfraToDomain(data);
  }

  async save(rack: DomainRackEntity): Promise<DomainRackEntity> {
    const infra = RackMapper.entityDomainToInfra(rack);
    const saved = await this.em.persistAndFlush(infra);
    return RackMapper.entityInfraToDomain(saved);
  }
}
```

#### Step 7: Create DTOs

```typescript
// src/infra/http/dtos/rack.dto.ts
export class CreateRackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  warehouseId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variantIds?: string[];
}

export class UpdateRackDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variantIds?: string[];
}
```

#### Step 8: Create DTO Mapper

```typescript
// src/infra/http/mappers/rack-dto.mapper.ts
export class RackDtoMapper {
  static createDtoToDomainEntity(dto: CreateRackDto): DomainRackEntity {
    return new DomainRackEntity({
      id: uuidv4(),
      name: dto.name,
      warehouseId: dto.warehouseId,
      variantIds: dto.variantIds,
    });
  }

  static updateDtoToPartialDomainEntity(dto: UpdateRackDto): Partial<DomainRackEntity> {
    const partial: Partial<DomainRackEntity> = {};
    
    if (dto.name !== undefined) partial.name = dto.name;
    if (dto.variantIds !== undefined) partial.variantIds = dto.variantIds;
    
    return partial;
  }
}
```

#### Step 9: Create Controller

```typescript
// src/infra/http/controllers/rack.controller.ts
@Controller('rack')
export class RackController {
  constructor(
    private readonly rackManagementUseCase: RackManagementUseCase,
  ) {}

  @Post()
  async createRack(@Body() createRackDto: CreateRackDto) {
    try {
      const rackEntity = RackDtoMapper.createDtoToDomainEntity(createRackDto);
      return await this.rackManagementUseCase.create(rackEntity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateRack(
    @Param('id') id: string,
    @Body() updateRackDto: UpdateRackDto,
  ) {
    try {
      const partialRackEntity = RackDtoMapper.updateDtoToPartialDomainEntity(updateRackDto);
      return await this.rackManagementUseCase.update(id, partialRackEntity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
```

#### Step 10: Update Module

```typescript
// src/infra/http/modules/warehouse.module.ts
@Module({
  providers: [
    // Add new repository
    {
      provide: 'IRackRepository',
      useClass: RackRepository,
    },
    
    // Add new domain service
    {
      provide: RackService,
      useFactory: (rackRepository) => {
        return new RackService(rackRepository);
      },
      inject: ['IRackRepository'],
    },
    
    // Add new use case
    {
      provide: 'RackManagementUseCase',
      useFactory: (rackRepository) => {
        return new RackManagementUseCaseImpl(rackRepository);
      },
      inject: ['IRackRepository'],
    },
  ],
  controllers: [WarehouseController, InventoryController, RackController],
})
export class WarehouseModule {}
```

### 3. Testing

#### Unit Tests (Domain Layer)

```typescript
// src/domain/warehouse/services/__tests__/rack.service.spec.ts
describe('RackService', () => {
  let service: RackService;
  let mockRepository: jest.Mocked<IRackRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      // ... other methods
    };
    service = new RackService(mockRepository);
  });

  it('should create rack with valid data', async () => {
    const rack = new DomainRackEntity({
      name: 'Test Rack',
      warehouseId: 'warehouse-id',
    });

    mockRepository.save.mockResolvedValue(rack);

    const result = await service.create(rack);

    expect(result).toBe(rack);
    expect(mockRepository.save).toHaveBeenCalledWith(rack);
  });

  it('should throw error for empty rack name', async () => {
    const rack = new DomainRackEntity({
      name: '',
      warehouseId: 'warehouse-id',
    });

    await expect(service.create(rack)).rejects.toThrow('Rack name is required');
  });
});
```

#### Integration Tests (Application Layer)

```typescript
// src/application/warehouse/use-cases/__tests__/rack-management.use-case.spec.ts
describe('RackManagementUseCase', () => {
  let useCase: RackManagementUseCaseImpl;
  let mockRepository: jest.Mocked<IRackRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      // ... other methods
    };
    useCase = new RackManagementUseCaseImpl(mockRepository);
  });

  it('should create rack successfully', async () => {
    const rack = new DomainRackEntity({
      name: 'Test Rack',
      warehouseId: 'warehouse-id',
    });

    mockRepository.save.mockResolvedValue(rack);

    const result = await useCase.create(rack);

    expect(result).toBe(rack);
    expect(mockRepository.save).toHaveBeenCalledWith(rack);
  });
});
```

#### E2E Tests (Infrastructure Layer)

```typescript
// test/rack.e2e-spec.ts
describe('Rack (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/rack (POST)', () => {
    return request(app.getHttpServer())
      .post('/rack')
      .send({
        name: 'Test Rack',
        warehouseId: 'warehouse-id',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('Test Rack');
        expect(res.body.warehouseId).toBe('warehouse-id');
      });
  });
});
```

### 4. Database Migrations

When adding new entities or modifying existing ones:

1. Generate migration:
```bash
npm run migration:create -- --name=AddRackTable
```

2. Implement migration:
```typescript
// migrations/Migration20240101000000.ts
export class Migration20240101000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "rack" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "warehouse_id" uuid NOT NULL REFERENCES "warehouse"("id"),
        "variant_ids" json,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        "created_by" varchar(255),
        "updated_by" varchar(255)
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE "rack";`);
  }
}
```

3. Run migration:
```bash
npm run migration:run
```

### 5. Code Quality

#### ESLint Configuration

The project uses ESLint with Clean Architecture rules:

```json
// .eslintrc.js
{
  "rules": {
    "import/no-restricted-paths": [
      "error",
      {
        "zones": [
          {
            "target": "./src/domain/**/*",
            "from": "./src/infra/**/*",
            "message": "Domain layer cannot import from infrastructure layer"
          },
          {
            "target": "./src/domain/**/*",
            "from": "./src/application/**/*",
            "message": "Domain layer cannot import from application layer"
          }
        ]
      }
    ]
  }
}
```

#### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 6. Environment Configuration

```typescript
// src/infra/config/index.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  postgresql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dbName: process.env.DB_NAME || 'warehouse_service',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
```

### 7. Logging

```typescript
// src/infra/http/controllers/warehouse.controller.ts
@Controller('warehouse')
export class WarehouseController {
  private readonly logger = new Logger(WarehouseController.name);

  @Post()
  async createWarehouse(@Body() createWarehouseDto: CreateWarehouseDto) {
    this.logger.log(`Creating warehouse: ${createWarehouseDto.name}`);
    
    try {
      const warehouseEntity = WarehouseDtoMapper.createDtoToDomainEntity(createWarehouseDto);
      const result = await this.manageWarehouseUseCase.create(warehouseEntity);
      
      this.logger.log(`Warehouse created successfully: ${result.getId()}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create warehouse: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }
}
```

## Best Practices

### 1. Domain Layer
- Keep business logic pure and framework-agnostic
- Use domain entities for data modeling
- Implement business rules in domain services
- Never import from infrastructure or application layers

### 2. Application Layer
- Orchestrate domain services
- Implement use cases
- Handle application-specific logic
- Can use framework decorators

### 3. Infrastructure Layer
- Handle all external concerns
- Implement repository interfaces
- Create DTOs with validation
- Map between DTOs and domain entities

### 4. Testing
- Unit test domain layer without framework setup
- Integration test application layer with mocked dependencies
- E2E test infrastructure layer with real database

### 5. Error Handling
- Use domain-specific exceptions
- Map domain exceptions to HTTP status codes in controllers
- Log errors appropriately
- Provide meaningful error messages

This development guide ensures consistent, maintainable, and testable code following Clean Architecture principles.
