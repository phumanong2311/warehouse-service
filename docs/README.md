# Warehouse Service Documentation

## 📚 Overview

Thư mục này chứa tất cả documentation liên quan đến Warehouse Service, bao gồm architecture, design patterns, và implementation guides.

## 📖 Documentation Index

### 🏗️ Architecture & Design
- [Product Architecture](./product-architecture.md) - Chi tiết về cấu trúc Product module theo Hexagonal Architecture và Clean Architecture

### 🔧 Implementation Guides
- [Setup Guide](./setup-guide.md) - Hướng dẫn setup và chạy project (sẽ tạo sau)
- [API Documentation](./api-docs.md) - API endpoints documentation (sẽ tạo sau)
- [Database Schema](./database-schema.md) - Cấu trúc database và relationships (sẽ tạo sau)

### 🧪 Testing
- [Testing Strategy](./testing-strategy.md) - Chiến lược testing cho từng layer (sẽ tạo sau)
- [Test Examples](./test-examples.md) - Ví dụ về cách viết tests (sẽ tạo sau)

### 🚀 Deployment
- [Deployment Guide](./deployment-guide.md) - Hướng dẫn deploy application (sẽ tạo sau)
- [Environment Configuration](./env-config.md) - Cấu hình environment variables (sẽ tạo sau)

## 🎯 Architecture Overview

Warehouse Service được xây dựng theo nguyên tắc **Hexagonal Architecture** và **Clean Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   HTTP API  │  │  Database   │  │   External  │        │
│  │ Controllers │  │ Repositories │  │   Services  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Use Cases  │  │ Application │  │   Command   │        │
│  │             │  │  Services   │  │   Handlers  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Entities   │  │   Domain    │  │ Repository  │        │
│  │             │  │  Services   │  │ Interfaces  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## 🏛️ Core Principles

### 1. **Dependency Rule**
- Dependencies chỉ hướng vào trong
- Domain layer không phụ thuộc bất kỳ layer nào khác
- Infrastructure layer phụ thuộc vào Application và Domain layers

### 2. **Framework Independence**
- Domain và Application layers không biết về NestJS
- Business logic có thể chạy độc lập với framework
- Dễ dàng migrate sang framework khác

### 3. **Testability**
- Mỗi layer có thể test độc lập
- Domain logic có thể test mà không cần database
- Use cases có thể test với mock repositories

### 4. **Separation of Concerns**
- **Domain**: Pure business logic
- **Application**: Business orchestration
- **Infrastructure**: Technical implementation

## 📁 Project Structure

```
src/
├── domain/                    # 🎯 Domain Layer
│   ├── product/              # Product domain
│   ├── warehouse/            # Warehouse domain
│   └── share/                # Shared domain utilities
├── application/              # 🎯 Application Layer
│   ├── product/              # Product use cases
│   ├── warehouse/            # Warehouse use cases
│   └── share/                # Shared application utilities
├── infra/                    # 🔧 Infrastructure Layer
│   ├── http/                 # HTTP infrastructure
│   ├── postgresql/           # Database infrastructure
│   └── config/               # Configuration
├── router/                   # 🛣️ Route configuration
└── main.ts                   # 🚀 Application entry point
```

## 🚀 Getting Started

1. **Setup Environment**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Run Database Migrations**
   ```bash
   pnpm migration:run
   ```

4. **Start Development Server**
   ```bash
   pnpm start:dev
   ```

## 📝 Contributing

Khi thêm features mới hoặc thay đổi architecture:

1. **Update Documentation**: Cập nhật docs tương ứng
2. **Follow Architecture**: Tuân thủ nguyên tắc Clean Architecture
3. **Write Tests**: Viết tests cho từng layer
4. **Update Examples**: Cập nhật examples trong docs

## 🔗 Related Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Note**: Documentation này sẽ được cập nhật liên tục khi project phát triển. Vui lòng đảm bảo luôn tham khảo phiên bản mới nhất.
