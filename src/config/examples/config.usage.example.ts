/**
 * Configuration Usage Examples
 * 
 * This file demonstrates how to use the configuration system
 * in different parts of your application.
 */

import { getConfig, appConfig, databaseConfig, jwtConfig } from '../app.config';
import { ConfigHelper } from '../utils/config.helper';

// Example 1: Basic configuration usage
export function basicConfigUsage() {
  // Get full configuration
  const config = getConfig();
  
  // Get specific configuration sections
  const app = appConfig();
  const db = databaseConfig();
  const jwt = jwtConfig();
  
  console.log('App running on port:', app.port);
  console.log('Database host:', db.host);
  console.log('JWT expires in:', jwt.expiresIn);
}

// Example 2: Using configuration helper
export function configHelperUsage() {
  const config = getConfig();
  
  // Check environment
  if (ConfigHelper.isDevelopment(config)) {
    console.log('Running in development mode');
  }
  
  if (ConfigHelper.isProduction(config)) {
    console.log('Running in production mode');
  }
  
  // Get database URL
  const dbUrl = ConfigHelper.getDatabaseUrl(config);
  console.log('Database URL:', dbUrl);
  
  // Get Redis URL
  const redisUrl = ConfigHelper.getRedisUrl(config);
  console.log('Redis URL:', redisUrl);
  
  // Get nested configuration
  const logLevel = ConfigHelper.getNestedValue(config, 'logging.level', 'info');
  console.log('Log level:', logLevel);
}

// Example 3: Environment-specific configuration
export function environmentSpecificConfig() {
  const config = getConfig();
  
  // Get environment-specific database config
  const dbConfig = ConfigHelper.getDatabaseConfig(config);
  console.log('Database config for current environment:', dbConfig);
  
  // Get environment-specific logging config
  const logConfig = ConfigHelper.getLoggingConfig(config);
  console.log('Logging config for current environment:', logConfig);
  
  // Get environment-specific security config
  const securityConfig = ConfigHelper.getSecurityConfig(config);
  console.log('Security config for current environment:', securityConfig);
}

// Example 4: Using configuration in a service
export class ExampleService {
  private config = getConfig();
  
  constructor() {
    // Initialize service with configuration
    this.initializeService();
  }
  
  private initializeService() {
    const { app, database, logging } = this.config;
    
    console.log(`Service initialized for ${app.environment} environment`);
    console.log(`Database: ${database.host}:${database.port}/${database.database}`);
    console.log(`Logging level: ${logging.level}`);
  }
  
  public getServiceConfig() {
    return {
      environment: this.config.app.environment,
      database: ConfigHelper.getDatabaseUrl(this.config),
      redis: ConfigHelper.getRedisUrl(this.config),
      isDevelopment: ConfigHelper.isDevelopment(this.config),
    };
  }
}

// Example 5: Using configuration in a controller
export class ExampleController {
  private config = getConfig();
  
  public getAppInfo() {
    const { app, monitoring } = this.config;
    
    return {
      name: 'Warehouse Service',
      version: '1.0.0',
      environment: app.environment,
      port: app.port,
      host: app.host,
      healthCheck: monitoring.enableHealthCheck,
      healthCheckPath: monitoring.healthCheckPath,
    };
  }
  
  public getDatabaseInfo() {
    const db = this.config.database;
    
    return {
      host: db.host,
      port: db.port,
      database: db.database,
      ssl: db.ssl,
      poolSize: db.poolSize,
    };
  }
}

// Example 6: Configuration validation
export function validateConfiguration() {
  try {
    const config = getConfig();
    console.log('✅ Configuration is valid');
    return config;
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
    throw error;
  }
}

// Example 7: Using configuration with middleware
export function middlewareExample(req: any, res: any, next: any) {
  // Configuration is automatically available on request object
  const config = req.config;
  
  if (ConfigHelper.isDevelopment(config)) {
    console.log('Development mode - additional logging enabled');
  }
  
  next();
}

// Example 8: Health check with configuration
export function healthCheck() {
  const config = getConfig();
  
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.app.environment,
    database: {
      host: config.database.host,
      port: config.database.port,
      connected: true, // This would be checked in a real implementation
    },
    redis: {
      host: config.redis.host,
      port: config.redis.port,
      connected: true, // This would be checked in a real implementation
    },
    services: {
      monitoring: config.monitoring.enableMetrics,
      healthCheck: config.monitoring.enableHealthCheck,
    },
  };
}

// Example 9: Configuration for different environments
export function getEnvironmentConfig() {
  const config = getConfig();
  
  const environmentConfig = {
    development: {
      logLevel: 'debug',
      enableMetrics: false,
      enableHealthCheck: true,
      database: {
        ssl: false,
        poolSize: 5,
      },
    },
    staging: {
      logLevel: 'info',
      enableMetrics: true,
      enableHealthCheck: true,
      database: {
        ssl: true,
        poolSize: 10,
      },
    },
    production: {
      logLevel: 'warn',
      enableMetrics: true,
      enableHealthCheck: true,
      database: {
        ssl: true,
        poolSize: 20,
      },
    },
  };
  
  return environmentConfig[config.app.environment];
}

// Example 10: Configuration for feature flags
export function getFeatureFlags() {
  const config = getConfig();
  
  return {
    enableEmail: !!config.email.host,
    enableFileStorage: config.fileStorage.type !== 'local',
    enableRedis: config.cache.type === 'redis',
    enableMetrics: config.monitoring.enableMetrics,
    enableHealthCheck: config.monitoring.enableHealthCheck,
    enableCors: config.security.enableCors,
    enableHelmet: config.security.enableHelmet,
  };
}
