# Warehouse Service

A comprehensive warehouse and inventory management service built with Clean Architecture principles using NestJS, TypeScript, and PostgreSQL.

## 🏗️ Architecture

This service follows **Clean Architecture** principles with clear separation of concerns:

- **Domain Layer**: Pure business logic, no framework dependencies
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: HTTP controllers, database, and external concerns

## 🚀 Features

### Warehouse Management
- Create, read, update, delete warehouses
- Warehouse pagination and filtering
- Warehouse validation and business rules

### Inventory Management
- Track inventory across warehouses
- Check-in and check-out operations
- Inventory transfers between warehouses
- Stock adjustments and write-offs
- Physical count adjustments

### Clean Architecture Benefits
- **Testable**: Domain logic can be unit tested without framework setup
- **Maintainable**: Clear separation of concerns
- **Flexible**: Easy to change frameworks or add new features
- **Independent**: Domain layer is framework-agnostic

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd warehouse-service
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Configure database connection in `.env`**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=warehouse_service
DB_USER=your_username
DB_PASSWORD=your_password
```

5. **Run database migrations**
```bash
npm run migration:run
```

6. **Start the development server**
```bash
npm run start:dev
```

## 📚 Documentation

- [Clean Architecture Guide](docs/clean-architecture-guide.md) - Detailed architecture explanation
- [API Documentation](docs/api-documentation.md) - Complete API reference
- [Development Guide](docs/development-guide.md) - How to add new features

## 🏛️ Project Structure

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
└── main.ts                      # Application entry point
```

## 🔄 Data Flow

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

## 🧪 Testing

### Unit Tests (Domain Layer)
```bash
npm run test
```

### Integration Tests (Application Layer)
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## 🗄️ Database

The service uses PostgreSQL with MikroORM for database operations. Key entities:

- **Warehouse**: Storage locations
- **Inventory**: Stock tracking
- **Rack**: Storage organization within warehouses
- **Unit**: Measurement units for inventory

## 📡 API Endpoints

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

## 🔧 Development

### Adding New Features

1. **Start with Domain Layer**: Define entities, services, and repository interfaces
2. **Implement Application Layer**: Create use cases and application services
3. **Build Infrastructure Layer**: Create DTOs, controllers, and repository implementations

See the [Development Guide](docs/development-guide.md) for detailed instructions.

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

### Database Migrations

```bash
# Generate migration
npm run migration:create -- --name=AddNewTable

# Run migrations
npm run migration:run

# Revert migration
npm run migration:down
```

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t warehouse-service .

# Run container
docker run -p 3000:3000 warehouse-service
```

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=warehouse_service
DB_USER=postgres
DB_PASSWORD=password

# Application
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

## 📊 Monitoring

The service includes:
- Request/response logging
- Error tracking
- Performance monitoring
- Health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow Clean Architecture principles
4. Write tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
- Check the [documentation](docs/)
- Review the [API documentation](docs/api-documentation.md)
- Open an issue on GitHub

---

**Built with ❤️ using Clean Architecture principles**
