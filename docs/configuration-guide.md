# Configuration System Guide

## Overview

The warehouse service uses a comprehensive configuration system with validation, error handling, and environment-specific settings. This system ensures that all required environment variables are properly set and validated before the application starts.

## Features

- ✅ **Type-safe configuration** with TypeScript interfaces
- ✅ **Comprehensive validation** with detailed error messages
- ✅ **Environment-specific overrides** for development, staging, and production
- ✅ **Health checks** for configuration validation
- ✅ **Helper utilities** for common configuration tasks
- ✅ **Middleware integration** for request-level config access

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp env.example .env
   ```

2. **Update the .env file with your values:**
   ```bash
   # Required variables
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret_at_least_32_characters
   JWT_REFRESH_SECRET=your_refresh_secret_at_least_32_characters
   SESSION_SECRET=your_session_secret_at_least_32_characters
   ```

3. **Start the application:**
   ```bash
   npm run start:dev
   ```

## Configuration Structure

### Application Configuration
```typescript
{
  app: {
    port: number;
    host: string;
    environment: 'development' | 'staging' | 'production';
    nodeEnv: string;
    cors: {
      origin: string[];
      credentials: boolean;
    };
    rateLimit: {
      windowMs: number;
      max: number;
    };
  }
}
```

### Database Configuration
```typescript
{
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
    poolSize: number;
    connectionTimeout: number;
    idleTimeout: number;
  }
}
```

### JWT Configuration
```typescript
{
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  }
}
```

### Redis Configuration
```typescript
{
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
    ttl: number;
  }
}
```

### Logging Configuration
```typescript
{
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'simple';
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
  }
}
```

### Security Configuration
```typescript
{
  security: {
    bcryptRounds: number;
    sessionSecret: string;
    enableHelmet: boolean;
    enableCors: boolean;
    trustedProxies: string[];
  }
}
```

### Monitoring Configuration
```typescript
{
  monitoring: {
    enableMetrics: boolean;
    metricsPort: number;
    enableHealthCheck: boolean;
    healthCheckPath: string;
  }
}
```

### Email Configuration
```typescript
{
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  }
}
```

### File Storage Configuration
```typescript
{
  fileStorage: {
    type: 'local' | 's3' | 'gcs';
    localPath?: string;
    s3?: {
      bucket: string;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
    maxFileSize: number;
    allowedMimeTypes: string[];
  }
}
```

### Cache Configuration
```typescript
{
  cache: {
    type: 'memory' | 'redis';
    ttl: number;
    maxItems: number;
    redis?: RedisConfig;
  }
}
```

## Usage Examples

### Basic Usage
```typescript
import { getConfig, appConfig, databaseConfig } from '@config';

// Get full configuration
const config = getConfig();

// Get specific configuration sections
const app = appConfig();
const db = databaseConfig();
```

### Using Configuration Helper
```typescript
import { ConfigHelper } from '@config';

const config = getConfig();

// Check environment
if (ConfigHelper.isDevelopment(config)) {
  console.log('Running in development mode');
}

// Get database URL
const dbUrl = ConfigHelper.getDatabaseUrl(config);

// Get nested configuration
const logLevel = ConfigHelper.getNestedValue(config, 'logging.level', 'info');
```

### Using Configuration Middleware
```typescript
// In your controller
@Controller('warehouse')
export class WarehouseController {
  @Get()
  findAll(@Req() req: Request) {
    // Access configuration from request
    const config = req.config;
    const isDev = ConfigHelper.isDevelopment(config);
    
    // Your logic here
  }
}
```

## Error Handling

The configuration system provides comprehensive error handling with detailed error messages:

### Configuration Validation Errors
```typescript
import { ConfigValidationError, ConfigErrorCode } from '@config';

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

### Error Codes
- `CONFIG_001`: Missing required environment variable
- `CONFIG_002`: Invalid variable type
- `CONFIG_003`: Invalid variable value
- `CONFIG_004`: Invalid variable format
- `CONFIG_005`: Invalid environment
- `CONFIG_006`: Invalid port range
- `CONFIG_007`: Invalid URL format
- `CONFIG_008`: Invalid email format
- `CONFIG_009`: Invalid database configuration
- `CONFIG_010`: Invalid JWT configuration
- `CONFIG_011`: Invalid Redis configuration
- `CONFIG_012`: Invalid file storage configuration
- `CONFIG_013`: Invalid cache configuration
- `CONFIG_014`: Invalid monitoring configuration
- `CONFIG_015`: Invalid security configuration
- `CONFIG_016`: Invalid logging configuration

## Environment Variables

### Required Variables
```bash
# Database
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT
JWT_SECRET=your_jwt_secret_at_least_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_at_least_32_characters

# Security
SESSION_SECRET=your_session_secret_at_least_32_characters

# Email (if using email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@yourdomain.com
```

### Optional Variables with Defaults
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

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_ENABLE_CONSOLE=true

# Security
BCRYPT_ROUNDS=12
ENABLE_HELMET=true
ENABLE_CORS=true

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090
ENABLE_HEALTH_CHECK=true
```

## Health Checks

The configuration system includes health checks to validate configuration:

```typescript
import { ConfigHealthIndicator } from '@config/health/config.health';

@Injectable()
export class HealthController {
  constructor(
    private configHealth: ConfigHealthIndicator,
  ) {}

  @Get('health/config')
  async checkConfig() {
    return this.configHealth.isHealthy('config');
  }

  @Get('health/database-config')
  async checkDatabaseConfig() {
    return this.configHealth.checkDatabaseConfig('database-config');
  }

  @Get('health/security-config')
  async checkSecurityConfig() {
    return this.configHealth.checkSecurityConfig('security-config');
  }
}
```

## Best Practices

1. **Always validate configuration on startup**
2. **Use environment-specific overrides**
3. **Keep secrets in environment variables**
4. **Use the helper utilities for common tasks**
5. **Implement health checks for configuration**
6. **Use TypeScript interfaces for type safety**
7. **Provide clear error messages for missing variables**

## Troubleshooting

### Common Issues

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

3. **Invalid variable value:**
   ```
   ❌ Configuration validation failed:
     • BCRYPT_ROUNDS: Environment variable 'BCRYPT_ROUNDS' has invalid value '5'. Must be between 10 and 15
   ```
   **Solution:** Set the variable to a valid value within the specified range

4. **Invalid environment:**
   ```
   ❌ Configuration validation failed:
     • NODE_ENV: Invalid environment 'test'. Must be one of: development, staging, production
   ```
   **Solution:** Set NODE_ENV to a valid environment

### Debug Mode

Enable debug mode to see detailed configuration information:

```bash
DEBUG=true npm run start:dev
```

This will show:
- All loaded environment variables
- Configuration validation results
- Environment-specific overrides
- Health check results

## Migration Guide

If you're upgrading from the old configuration system:

1. **Update imports:**
   ```typescript
   // Old
   import { appConfig } from '@config';
   
   // New
   import { getConfig, appConfig } from '@config';
   ```

2. **Update usage:**
   ```typescript
   // Old
   const config = appConfig;
   
   // New
   const config = getConfig();
   const app = appConfig();
   ```

3. **Add environment variables:**
   - Copy from `env.example`
   - Update with your values
   - Ensure all required variables are set

## Support

For configuration-related issues:

1. Check the error messages for specific variable issues
2. Verify all required variables are set in your .env file
3. Ensure variable types and values are correct
4. Check the `env.example` file for reference
5. Use the health check endpoints to validate configuration
