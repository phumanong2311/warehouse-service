# Architecture Diagrams

## Clean Architecture Overview

```mermaid
graph TB
    subgraph "Infrastructure Layer"
        HTTP[HTTP Controllers]
        DTO[DTOs & Validation]
        DB[(PostgreSQL Database)]
        REPO[Repository Implementations]
    end
    
    subgraph "Application Layer"
        UC[Use Cases]
        AS[Application Services]
    end
    
    subgraph "Domain Layer"
        DE[Domain Entities]
        DS[Domain Services]
        RI[Repository Interfaces]
    end
    
    HTTP --> DTO
    DTO --> UC
    UC --> AS
    AS --> DS
    DS --> RI
    RI --> REPO
    REPO --> DB
    
    classDef infrastructure fill:#e1f5fe
    classDef application fill:#f3e5f5
    classDef domain fill:#e8f5e8
    
    class HTTP,DTO,DB,REPO infrastructure
    class UC,AS application
    class DE,DS,RI domain
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant DTOMapper
    participant UseCase
    participant DomainService
    participant Repository
    participant Database
    
    Client->>Controller: HTTP Request (DTO)
    Controller->>DTOMapper: Map DTO to Domain Entity
    DTOMapper-->>Controller: Domain Entity
    Controller->>UseCase: Execute Use Case
    UseCase->>DomainService: Business Logic
    DomainService->>Repository: Data Access
    Repository->>Database: SQL Query
    Database-->>Repository: Result
    Repository-->>DomainService: Domain Entity
    DomainService-->>UseCase: Result
    UseCase-->>Controller: Response
    Controller-->>Client: HTTP Response
```

## Layer Dependencies

```mermaid
graph LR
    subgraph "Dependency Direction"
        A[Infrastructure] --> B[Application]
        B --> C[Domain]
    end
    
    subgraph "Infrastructure Layer"
        I1[HTTP Controllers]
        I2[DTOs & Mappers]
        I3[Database Repositories]
        I4[External Services]
    end
    
    subgraph "Application Layer"
        A1[Use Cases]
        A2[Application Services]
        A3[Application Interfaces]
    end
    
    subgraph "Domain Layer"
        D1[Domain Entities]
        D2[Domain Services]
        D3[Repository Interfaces]
        D4[Domain Interfaces]
    end
    
    I1 --> A1
    I2 --> A1
    I3 --> D3
    A1 --> D2
    A2 --> D2
    A3 --> D4
```

## Warehouse Service Components

```mermaid
graph TB
    subgraph "HTTP Layer"
        WC[Warehouse Controller]
        IC[Inventory Controller]
        RC[Rack Controller]
    end
    
    subgraph "DTOs & Mappers"
        WD[Warehouse DTOs]
        ID[Inventory DTOs]
        RD[Rack DTOs]
        WM[Warehouse Mapper]
        IM[Inventory Mapper]
        RM[Rack Mapper]
    end
    
    subgraph "Use Cases"
        WUC[Warehouse Use Cases]
        IUC[Inventory Use Cases]
        RUC[Rack Use Cases]
    end
    
    subgraph "Domain Services"
        WS[Warehouse Service]
        IS[Inventory Service]
        RS[Rack Service]
        US[Unit Service]
    end
    
    subgraph "Domain Entities"
        WE[Warehouse Entity]
        IE[Inventory Entity]
        RE[Rack Entity]
        UE[Unit Entity]
    end
    
    subgraph "Repository Layer"
        WR[Warehouse Repository]
        IR[Inventory Repository]
        RR[Rack Repository]
        UR[Unit Repository]
    end
    
    WC --> WD
    IC --> ID
    RC --> RD
    
    WD --> WM
    ID --> IM
    RD --> RM
    
    WM --> WUC
    IM --> IUC
    RM --> RUC
    
    WUC --> WS
    IUC --> IS
    RUC --> RS
    
    WS --> WE
    IS --> IE
    RS --> RE
    US --> UE
    
    WS --> WR
    IS --> IR
    RS --> RR
    US --> UR
```

## Database Schema

```mermaid
erDiagram
    WAREHOUSE {
        uuid id PK
        string name
        string code UK
        string phone
        string email
        string address
        string description
        timestamp created_at
        timestamp updated_at
        string created_by
        string updated_by
    }
    
    RACK {
        uuid id PK
        string name
        uuid warehouse_id FK
        json variant_ids
        timestamp created_at
        timestamp updated_at
        string created_by
        string updated_by
    }
    
    INVENTORY {
        uuid id PK
        uuid warehouse_id FK
        string variant_id
        uuid unit_id FK
        integer quantity
        string status
        string batch
        timestamp expiration_date
        timestamp created_at
        timestamp updated_at
        string created_by
        string updated_by
    }
    
    UNIT {
        uuid id PK
        string name
        string description
        decimal conversion_rate
        timestamp created_at
        timestamp updated_at
        string created_by
        string updated_by
    }
    
    WAREHOUSE ||--o{ RACK : contains
    WAREHOUSE ||--o{ INVENTORY : stores
    RACK ||--o{ INVENTORY : organizes
    UNIT ||--o{ INVENTORY : measures
```

## Service Integration

```mermaid
graph TB
    subgraph "External Services"
        PS[Product Service]
        US[User Service]
        NS[Notification Service]
    end
    
    subgraph "Warehouse Service"
        WS[Warehouse Service]
        IS[Inventory Service]
    end
    
    subgraph "Communication"
        HTTP[HTTP/REST]
        MQ[Message Queue]
        EVT[Events]
    end
    
    PS -.->|variant validation| WS
    US -.->|user authentication| WS
    WS -.->|inventory updates| NS
    
    WS --> HTTP
    IS --> MQ
    WS --> EVT
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Nginx/HAProxy]
    end
    
    subgraph "Application Tier"
        WS1[Warehouse Service Instance 1]
        WS2[Warehouse Service Instance 2]
        WS3[Warehouse Service Instance 3]
    end
    
    subgraph "Database Tier"
        PG[(PostgreSQL Primary)]
        PG2[(PostgreSQL Replica)]
    end
    
    subgraph "Cache Layer"
        REDIS[(Redis Cache)]
    end
    
    subgraph "Message Queue"
        MQ[RabbitMQ/Kafka]
    end
    
    LB --> WS1
    LB --> WS2
    LB --> WS3
    
    WS1 --> PG
    WS2 --> PG
    WS3 --> PG
    
    WS1 --> PG2
    WS2 --> PG2
    WS3 --> PG2
    
    WS1 --> REDIS
    WS2 --> REDIS
    WS3 --> REDIS
    
    WS1 --> MQ
    WS2 --> MQ
    WS3 --> MQ
```

## Testing Strategy

```mermaid
graph TB
    subgraph "Testing Pyramid"
        E2E[E2E Tests<br/>Full System]
        INT[Integration Tests<br/>Application Layer]
        UNIT[Unit Tests<br/>Domain Layer]
    end
    
    subgraph "Test Types"
        UT[Unit Tests]
        IT[Integration Tests]
        E2ET[End-to-End Tests]
        PT[Performance Tests]
    end
    
    subgraph "Test Tools"
        JEST[Jest]
        SUPT[Supertest]
        CYPRESS[Cypress]
        K6[K6]
    end
    
    UNIT --> UT
    INT --> IT
    E2E --> E2ET
    
    UT --> JEST
    IT --> JEST
    E2ET --> SUPT
    E2ET --> CYPRESS
    PT --> K6
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        AUTH[Authentication]
        AUTHZ[Authorization]
        VALID[Input Validation]
        ENCRYPT[Encryption]
    end
    
    subgraph "Security Components"
        JWT[JWT Tokens]
        RBAC[Role-Based Access Control]
        DTO[DTO Validation]
        HTTPS[HTTPS/TLS]
    end
    
    subgraph "Security Measures"
        RATE[Rate Limiting]
        CORS[CORS Policy]
        HELMET[Security Headers]
        AUDIT[Audit Logging]
    end
    
    AUTH --> JWT
    AUTHZ --> RBAC
    VALID --> DTO
    ENCRYPT --> HTTPS
    
    JWT --> RATE
    RBAC --> CORS
    DTO --> HELMET
    HTTPS --> AUDIT
```

These diagrams provide a comprehensive view of the warehouse service architecture, showing how Clean Architecture principles are applied and how different components interact with each other.
