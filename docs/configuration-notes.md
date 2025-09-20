# 📝 Configuration System Notes - Warehouse Service

## 🎯 **Tổng quan**

Configuration system được thiết kế đặc biệt cho warehouse service, chỉ bao gồm những gì cần thiết cho quản lý kho hàng.

## 📁 **Cấu trúc thư mục**

```
src/config/
├── types/config.types.ts          # TypeScript interfaces
├── errors/config.errors.ts        # Error handling
├── validators/config.validator.ts  # Validation logic
├── utils/config.helper.ts         # Helper utilities
├── health/config.health.ts        # Health checks
├── app.config.ts                  # Main config loader
└── index.ts                       # Exports
```

## 🔧 **Các loại configuration**

### 1. **Application Config**
```typescript
{
  port: number;                    // PORT=3000
  host: string;                    // HOST=localhost
  environment: 'development' | 'staging' | 'production';
  cors: { origin: string[]; credentials: boolean };
  rateLimit: { windowMs: number; max: number };
}
```

### 2. **Database Config**
```typescript
{
  host: string;                    // DB_HOST=localhost
  port: number;                   // DB_PORT=5432
  username: string;                // DB_USERNAME=warehouse_user
  password: string;                // DB_PASSWORD=your_password
  database: string;                // DB_NAME=warehouse_db
  ssl: boolean;                    // DB_SSL=false
  poolSize: number;                // DB_POOL_SIZE=10
  connectionTimeout: number;      // DB_CONNECTION_TIMEOUT=30000
  idleTimeout: number;             // DB_IDLE_TIMEOUT=30000
}
```

### 3. **Logging Config**
```typescript
{
  level: 'error' | 'warn' | 'info' | 'debug';  // LOG_LEVEL=info
  enableConsole: boolean;                       // LOG_ENABLE_CONSOLE=true
}
```

### 4. **Security Config**
```typescript
{
  enableHelmet: boolean;           // ENABLE_HELMET=true
  enableCors: boolean;            // ENABLE_CORS=true
  trustedProxies: string[];       // TRUSTED_PROXIES=
}
```

### 5. **Monitoring Config**
```typescript
{
  enableHealthCheck: boolean;     // ENABLE_HEALTH_CHECK=true
  healthCheckPath: string;        // HEALTH_CHECK_PATH=/health
}
```

## 🚀 **Cách sử dụng**

### **Basic Usage**
```typescript
import { getConfig, appConfig, databaseConfig } from '@config';

// Get full configuration
const config = getConfig();

// Get specific sections
const app = appConfig();
const db = databaseConfig();
```

### **Helper Utilities**
```typescript
import { ConfigHelper } from '@config';

const config = getConfig();

// Environment checks
if (ConfigHelper.isDevelopment(config)) {
  console.log('Development mode');
}

// Get database URL
const dbUrl = ConfigHelper.getDatabaseUrl(config);
```

### **In Controllers**
```typescript
@Controller('warehouse')
export class WarehouseController {
  @Get()
  findAll(@Req() req: Request) {
    const config = req.config; // Available via middleware
    const isDev = ConfigHelper.isDevelopment(config);
    // Your logic here
  }
}
```

## 🔍 **Environment Variables**

### **Required Variables (Chỉ 3 biến!)**
```bash
DB_USERNAME=warehouse_user
DB_PASSWORD=your_secure_password
DB_NAME=warehouse_db
```

### **Optional Variables (có defaults)**
```bash
# Application
PORT=3000
HOST=localhost
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_SSL=false
DB_POOL_SIZE=10
DB_CONNECTION_TIMEOUT=30000
DB_IDLE_TIMEOUT=30000

# Logging
LOG_LEVEL=info
LOG_ENABLE_CONSOLE=true

# Security
ENABLE_HELMET=true
ENABLE_CORS=true
TRUSTED_PROXIES=

# Monitoring
ENABLE_HEALTH_CHECK=true
HEALTH_CHECK_PATH=/health
```

## 🏥 **Health Check**

### **Mục đích**
- Monitor tình trạng service 24/7
- Auto-recover khi có vấn đề
- Load balancer integration
- Container orchestration

### **Usage**
```typescript
@Controller('health')
export class HealthController {
  @Get()
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'warehouse-service'
    };
  }
}
```

## ⚠️ **Error Handling**

### **Error Codes**
- `CONFIG_001`: Missing required environment variable
- `CONFIG_002`: Invalid variable type
- `CONFIG_003`: Invalid variable value
- `CONFIG_004`: Invalid variable format
- `CONFIG_005`: Invalid environment
- `CONFIG_006`: Invalid port range
- `CONFIG_007`: Invalid URL format
- `CONFIG_008`: Invalid email format

### **Error Example**
```typescript
try {
  const config = getConfig();
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error('Configuration validation failed:');
    error.errors.forEach(err => {
      console.error(`• ${err.variable}: ${err.message}`);
    });
  }
}
```

## 🧪 **Testing**

### **Test Configuration**
```typescript
describe('Configuration System', () => {
  it('should validate required environment variables', () => {
    delete process.env.DB_USERNAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_NAME;

    const validator = new ConfigValidator();
    expect(() => validator.validateAll()).toThrow();
    expect(validator.hasErrors()).toBe(true);
  });
});
```

## 📋 **Quick Setup**

### **1. Copy environment file**
```bash
cp env.example .env
```

### **2. Set required variables**
```bash
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

### **3. Start application**
```bash
npm run start:dev
```

## 🎯 **Best Practices**

1. **Always validate configuration on startup**
2. **Use environment-specific overrides**
3. **Keep secrets in environment variables**
4. **Use helper utilities for common tasks**
5. **Implement health checks for configuration**
6. **Use TypeScript interfaces for type safety**

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Missing required variables:**
   ```
   ❌ Configuration validation failed:
     • DB_USERNAME: Required environment variable 'DB_USERNAME' is not set
   ```
   **Solution:** Set the missing environment variable in your .env file

2. **Invalid variable type:**
   ```
   ❌ Configuration validation failed:
     • PORT: Environment variable 'PORT' should be of type number, but received string
   ```
   **Solution:** Ensure the variable is a valid number

3. **Invalid port range:**
   ```
   ❌ Configuration validation failed:
     • PORT: Environment variable 'PORT' port 70000 is out of valid range (1-65535)
   ```
   **Solution:** Set PORT to a valid port number (1-65535)

## 📊 **Configuration Comparison**

| Aspect | Before | After |
|--------|--------|-------|
| **Total Variables** | 50+ | 15 |
| **Required Variables** | 10+ | 3 |
| **Configuration Sections** | 10 | 5 |
| **Validation Methods** | 15+ | 5 |
| **Error Codes** | 16 | 8 |

## 🎉 **Benefits**

1. **Type Safety**: Compile-time error prevention
2. **Validation**: Runtime validation with detailed error messages
3. **Environment Support**: Development, staging, production configurations
4. **Error Handling**: Comprehensive error system with specific error codes
5. **Health Checks**: Configuration validation in health endpoints
6. **Helper Utilities**: Common configuration tasks made easy
7. **Documentation**: Comprehensive guides and examples
8. **Testing**: Full test coverage for validation logic

## 🚀 **Next Steps**

1. Copy `env.example` to `.env`
2. Set your 3 required database variables
3. Start the application - configuration will be validated automatically
4. Use the configuration system in your services and controllers
5. Implement health checks for configuration validation
6. Add custom validation for your specific requirements

---

**💡 Tip:** Configuration system được thiết kế đặc biệt cho warehouse service, chỉ bao gồm những gì cần thiết cho quản lý kho hàng. Không có JWT, email, file storage hay các tính năng phức tạp khác!
