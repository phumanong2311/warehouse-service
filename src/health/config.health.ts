import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class ConfigHealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Simple health check for basic environment variables
      const requiredVars = [
        'DB_HOST',
        'DB_PORT', 
        'DB_USERNAME',
        'DB_PASSWORD',
        'DB_NAME'
      ];

      const results: Record<string, any> = {};
      
      for (const varName of requiredVars) {
        results[varName] = {
          status: 'up',
          configured: !!process.env[varName],
          timestamp: new Date().toISOString(),
        };
      }

      const isHealthy = requiredVars.every(varName => !!process.env[varName]);
      
      if (!isHealthy) {
        throw new Error('Required environment variables are missing');
      }

      return { [key]: { status: 'up', ...results } };
    } catch (error) {
      throw new Error(`Configuration health check failed: ${error.message}`);
    }
  }

  async checkDatabaseConfig(key: string): Promise<HealthIndicatorResult> {
    try {
      // Validate database configuration from environment variables
      const isValid = !!(
        process.env.DB_HOST &&
        process.env.DB_PORT &&
        process.env.DB_USERNAME &&
        process.env.DB_PASSWORD &&
        process.env.DB_NAME
      );

      if (!isValid) {
        throw new Error('Database configuration is incomplete');
      }

      return { [key]: { 
        status: 'up', 
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true',
      } };
    } catch (error) {
      throw new Error(`Database configuration check failed: ${error.message}`);
    }
  }
}
