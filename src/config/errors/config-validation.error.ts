import { ConfigError } from './config.errors';

export class ConfigValidationError extends Error {
  public readonly errors: ConfigError[];

  constructor(errors: ConfigError[]) {
    const errorMessages = errors.map(err => `${err.variable}: ${err.message}`).join(', ');
    super(`Configuration validation failed: ${errorMessages}`);
    this.name = 'ConfigValidationError';
    this.errors = errors;
  }
}
