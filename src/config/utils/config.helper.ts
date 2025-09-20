import { FullConfig } from '../types/config.types';

export class ConfigHelper {
  /**
   * Get a nested configuration value using dot notation
   * @param config The full configuration object
   * @param path The dot-separated path to the value
   * @param defaultValue The default value if the path doesn't exist
   * @returns The configuration value or default
   */
  static getNestedValue<T = any>(
    config: FullConfig,
    path: string,
    defaultValue?: T
  ): T | undefined {
    const keys = path.split('.');
    let current: any = config;
    
    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current !== undefined ? current : defaultValue;
  }

  /**
   * Check if the application is running in development mode
   */
  static isDevelopment(config: FullConfig): boolean {
    return config.app.environment === 'development';
  }

  /**
   * Check if the application is running in production mode
   */
  static isProduction(config: FullConfig): boolean {
    return config.app.environment === 'production';
  }

  /**
   * Check if the application is running in staging mode
   */
  static isStaging(config: FullConfig): boolean {
    return config.app.environment === 'staging';
  }

  /**
   * Get the database connection string
   */
  static getDatabaseUrl(config: FullConfig): string {
    const { host, port, username, password, database, ssl } = config.database;
    const protocol = ssl ? 'postgresql' : 'postgresql';
    return `${protocol}://${username}:${password}@${host}:${port}/${database}`;
  }


  /**
   * Validate that all required environment variables are set
   */
  static validateRequiredVars(requiredVars: string[]): void {
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  /**
   * Get configuration for a specific environment
   */
  static getEnvironmentConfig(config: FullConfig) {
    const env = config.app.environment;
    
    return {
      isDevelopment: env === 'development',
      isProduction: env === 'production',
      isStaging: env === 'staging',
      isTest: env === 'test',
    };
  }

  /**
   * Get database configuration with environment-specific overrides
   */
  static getDatabaseConfig(config: FullConfig) {
    const baseConfig = config.database;
    
    if (ConfigHelper.isProduction(config)) {
      return {
        ...baseConfig,
        ssl: true,
        poolSize: Math.max(baseConfig.poolSize, 20),
      };
    }
    
    if (ConfigHelper.isDevelopment(config)) {
      return {
        ...baseConfig,
        ssl: false,
        poolSize: Math.min(baseConfig.poolSize, 5),
      };
    }
    
    return baseConfig;
  }

  /**
   * Get logging configuration with environment-specific overrides
   */
  static getLoggingConfig(config: FullConfig) {
    const baseConfig = config.logging;
    
    if (ConfigHelper.isProduction(config)) {
      return {
        ...baseConfig,
        level: 'warn' as const,
        enableConsole: false,
      };
    }
    
    if (ConfigHelper.isDevelopment(config)) {
      return {
        ...baseConfig,
        level: 'debug' as const,
        enableConsole: true,
      };
    }
    
    return baseConfig;
  }

  /**
   * Get security configuration with environment-specific overrides
   */
  static getSecurityConfig(config: FullConfig) {
    const baseConfig = config.security;
    
    if (ConfigHelper.isProduction(config)) {
      return {
        ...baseConfig,
        enableHelmet: true,
        enableCors: true,
      };
    }
    
    return baseConfig;
  }

  /**
   * Get monitoring configuration with environment-specific overrides
   */
  static getMonitoringConfig(config: FullConfig) {
    const baseConfig = config.monitoring;
    
    if (ConfigHelper.isDevelopment(config)) {
      return {
        ...baseConfig,
        enableHealthCheck: true,
      };
    }
    
    return baseConfig;
  }
}
