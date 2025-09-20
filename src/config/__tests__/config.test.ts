import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ConfigValidator } from '../validators/config.validator';
import { ConfigErrorCode } from '../errors/config.errors';

describe('Configuration System', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('ConfigValidator', () => {
    it('should validate required environment variables', () => {
      // Clear required variables
      delete process.env.DB_USERNAME;
      delete process.env.DB_PASSWORD;
      delete process.env.DB_NAME;
      delete process.env.JWT_SECRET;
      delete process.env.JWT_REFRESH_SECRET;
      delete process.env.SESSION_SECRET;

      const validator = new ConfigValidator();
      
      expect(() => validator.validateAll()).toThrow();
      expect(validator.hasErrors()).toBe(true);
      
      const errors = validator.getErrors();
      expect(errors.some(error => error.code === ConfigErrorCode.MISSING_REQUIRED_VAR)).toBe(true);
    });

    it('should validate port ranges', () => {
      process.env.PORT = '70000'; // Invalid port
      process.env.DB_PORT = '70000'; // Invalid port
      
      // Set required variables
      process.env.DB_USERNAME = 'test';
      process.env.DB_PASSWORD = 'test';
      process.env.DB_NAME = 'test';
      process.env.JWT_SECRET = 'test_secret_at_least_32_characters_long';
      process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_at_least_32_characters_long';
      process.env.SESSION_SECRET = 'test_session_secret_at_least_32_characters_long';

      const validator = new ConfigValidator();
      
      expect(() => validator.validateAll()).toThrow();
      expect(validator.hasErrors()).toBe(true);
      
      const errors = validator.getErrors();
      expect(errors.some(error => error.code === ConfigErrorCode.INVALID_PORT_RANGE)).toBe(true);
    });


    it('should validate environment values', () => {
      process.env.NODE_ENV = 'invalid'; // Invalid environment
      
      // Set required variables
      process.env.DB_USERNAME = 'test';
      process.env.DB_PASSWORD = 'test';
      process.env.DB_NAME = 'test';
      process.env.JWT_SECRET = 'test_secret_at_least_32_characters_long';
      process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_at_least_32_characters_long';
      process.env.SESSION_SECRET = 'test_session_secret_at_least_32_characters_long';

      const validator = new ConfigValidator();
      
      expect(() => validator.validateAll()).toThrow();
      expect(validator.hasErrors()).toBe(true);
      
      const errors = validator.getErrors();
      expect(errors.some(error => error.code === ConfigErrorCode.INVALID_ENVIRONMENT)).toBe(true);
    });


    it('should validate with correct configuration', () => {
      // Set all required variables with valid values
      process.env.DB_USERNAME = 'test_user';
      process.env.DB_PASSWORD = 'test_password';
      process.env.DB_NAME = 'test_db';

      const validator = new ConfigValidator();
      
      expect(() => validator.validateAll()).not.toThrow();
      expect(validator.hasErrors()).toBe(false);
    });
  });
});
