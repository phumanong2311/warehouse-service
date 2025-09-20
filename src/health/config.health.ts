import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { getConfig } from '../config/app.config';

@Injectable()
export class ConfigHealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const config = getConfig();
      
      // Check if all required configurations are present
      const requiredChecks = [
        { name: 'app', value: config.app },
        { name: 'database', value: config.database },
        { name: 'security', value: config.security },
      ];

      const results: Record<string, any> = {};
      
      for (const check of requiredChecks) {
        results[check.name] = {
          status: 'up',
          configured: !!check.value,
          timestamp: new Date().toISOString(),
        };
      }

      const isHealthy = requiredChecks.every(check => !!check.value);
      
      if (!isHealthy) {
        throw new Error('Configuration health check failed');
      }

      return { [key]: { status: 'up', ...results } };
    } catch (error) {
      throw new Error(`Configuration health check failed: ${error.message}`);
    }
  }

  async checkDatabaseConfig(key: string): Promise<HealthIndicatorResult> {
    try {
      const config = getConfig();
      const dbConfig = config.database;
      
      // Validate database configuration
      const isValid = !!(
        dbConfig.host &&
        dbConfig.port &&
        dbConfig.username &&
        dbConfig.password &&
        dbConfig.database
      );

      if (!isValid) {
        throw new Error('Database configuration is incomplete');
      }

      return { [key]: { 
        status: 'up', 
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        ssl: dbConfig.ssl,
        poolSize: dbConfig.poolSize,
      } };
    } catch (error) {
      throw new Error(`Database configuration check failed: ${error.message}`);
    }
  }

  async checkSecurityConfig(key: string): Promise<HealthIndicatorResult> {
    try {
      const config = getConfig();
      const securityConfig = config.security;
      
      // Validate security configuration
      const isValid = !!(
        securityConfig.enableHelmet !== undefined &&
        securityConfig.enableCors !== undefined
      );

      if (!isValid) {
        throw new Error('Security configuration is invalid');
      }

      return { [key]: { 
        status: 'up', 
        enableHelmet: securityConfig.enableHelmet,
        enableCors: securityConfig.enableCors,
        trustedProxies: securityConfig.trustedProxies.length,
      } };
    } catch (error) {
      throw new Error(`Security configuration check failed: ${error.message}`);
    }
  }
}
