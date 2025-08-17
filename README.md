<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Warehouse Service

A modern warehouse management system built with **NestJS** and **Hexagonal Architecture**.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Clean Architecture) principles:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and application services  
- **Infrastructure Layer**: Database, external APIs, and implementations
- **Presentation Layer**: HTTP controllers and API endpoints

For detailed architecture documentation, see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env-example.txt .env

# Update environment variables in .env file
```

### Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d

# Run migrations
pnpm run migration:run

# Seed data (optional)
pnpm run seed
```

### Development

```bash
# Start development server
pnpm run start:dev

# Run tests
pnpm run test

# Run e2e tests
pnpm run test:e2e
```

## 📁 Project Structure

```
src/
├── domain/                    # Core business logic
│   └── warehouse/
│       ├── entities/          # Domain entities
│       ├── interface-repositories/ # Repository interfaces
│       └── services/          # Domain services
├── application/               # Use cases & application logic
│   └── warehouse/
│       ├── services/          # Application services
│       ├── interfaces/        # Service interfaces
│       ├── dtos/              # Request/Response DTOs
│       └── modules/           # Application modules
├── infrastructure/            # External concerns
│   └── postgresql/
│       ├── repositories/      # Repository implementations
│       ├── mappers/           # Data mappers
│       └── entities/          # Database entities
└── presentation/              # Controllers & HTTP concerns
    └── warehouse/
        └── controllers/       # HTTP controllers
```

## 🔧 Key Features

- ✅ **Hexagonal Architecture**: Clean separation of concerns
- ✅ **TypeScript**: Full type safety
- ✅ **NestJS**: Modern Node.js framework
- ✅ **MikroORM**: Type-safe database ORM
- ✅ **PostgreSQL**: Robust relational database
- ✅ **Dependency Injection**: IoC container
- ✅ **Validation**: Request/response validation
- ✅ **Testing**: Unit, integration, and e2e tests

## 📚 API Documentation

### Warehouse Endpoints

- `GET /warehouse` - Get warehouses with pagination
- `GET /warehouse/all` - Get all warehouses
- `GET /warehouse/:id` - Get warehouse by ID

### Example Request

```bash
# Get warehouses with pagination
curl "http://localhost:3000/warehouse?limit=10&page=1&name=Main"

# Get warehouse by ID
curl "http://localhost:3000/warehouse/123e4567-e89b-12d3-a456-426614174000"
```

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# Integration tests
pnpm run test:integration

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📝 Development Guidelines

### Adding New Entity

1. Create domain entity in `src/domain/[entity]/entities/`
2. Create repository interface in `src/domain/[entity]/interface-repositories/`
3. Create application service in `src/application/[entity]/services/`
4. Create infrastructure repository in `src/infrastructure/postgresql/repositories/`
5. Create mapper in `src/infrastructure/postgresql/mappers/`
6. Create controller in `src/presentation/[entity]/controllers/`
7. Update modules and exports

### Code Style

- Follow TypeScript best practices
- Use dependency injection
- Implement interfaces for loose coupling
- Write unit tests for business logic
- Use DTOs for data validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the architecture guidelines
4. Write tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [NestJS Documentation](https://docs.nestjs.com/)
- [MikroORM Documentation](https://mikro-orm.io/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
