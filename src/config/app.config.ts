import { config } from 'dotenv';
import { ConfigValidator } from './validators/config.validator';
import { ConfigValidationError } from './errors/config-validation.error';
import { FullConfig } from './types/config.types';

// Load environment variables
config();

let validatedConfig: FullConfig | null = null;

export function getConfig(): FullConfig {
  if (!validatedConfig) {
    try {
      const validator = new ConfigValidator();
      validatedConfig = validator.validateAll();
    } catch (error) {
      if (error instanceof ConfigValidationError) {
        console.error('❌ Configuration validation failed:');
        error.errors.forEach(err => {
          console.error(`  • ${err.variable}: ${err.message}`);
          if (err.expectedType) {
            console.error(`    Expected: ${err.expectedType}`);
          }
          if (err.receivedValue !== undefined) {
            console.error(`    Received: ${err.receivedValue}`);
          }
        });
        console.error('\n💡 Please check your .env file and ensure all required variables are set correctly.');
        console.error('📋 See env.example for a complete list of required variables.');
        process.exit(1);
      }
      throw error;
    }
  }
  return validatedConfig;
}

// Export individual config sections for convenience
export const appConfig = () => getConfig().app;
export const databaseConfig = () => getConfig().database;
export const loggingConfig = () => getConfig().logging;
export const securityConfig = () => getConfig().security;
export const monitoringConfig = () => getConfig().monitoring;

// Export the full config (already exported above)
