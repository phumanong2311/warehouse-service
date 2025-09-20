import * as env from 'env-var';
import { ConfigError, ConfigErrorCode, ConfigErrorMessages } from '../errors/config.errors';
import { ConfigValidationError } from '../errors/config-validation.error';
import { FullConfig } from '../types/config.types';

export class ConfigValidator {
  private errors: ConfigError[] = [];

  private addError(code: ConfigErrorCode, message: string, variable?: string, expectedType?: string, receivedValue?: any): void {
    this.errors.push(new ConfigError(code, message, variable, expectedType, receivedValue));
  }

  private validateRequired(variableName: string, value: any): boolean {
    if (value === undefined || value === null || value === '') {
      this.addError(
        ConfigErrorCode.MISSING_REQUIRED_VAR,
        ConfigErrorMessages[ConfigErrorCode.MISSING_REQUIRED_VAR](variableName),
        variableName
      );
      return false;
    }
    return true;
  }

  private validatePort(variableName: string, port: number): boolean {
    if (port < 1 || port > 65535) {
      this.addError(
        ConfigErrorCode.INVALID_PORT_RANGE,
        ConfigErrorMessages[ConfigErrorCode.INVALID_PORT_RANGE](variableName, port),
        variableName,
        'number (1-65535)',
        port
      );
      return false;
    }
    return true;
  }

  private validateUrl(variableName: string, url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      this.addError(
        ConfigErrorCode.INVALID_URL_FORMAT,
        ConfigErrorMessages[ConfigErrorCode.INVALID_URL_FORMAT](variableName, url),
        variableName,
        'valid URL',
        url
      );
      return false;
    }
  }


  private validateEnvironment(env: string): boolean {
    const validEnvs = ['development', 'staging', 'production'];
    if (!validEnvs.includes(env)) {
      this.addError(
        ConfigErrorCode.INVALID_ENVIRONMENT,
        ConfigErrorMessages[ConfigErrorCode.INVALID_ENVIRONMENT](env),
        'NODE_ENV',
        'development | staging | production',
        env
      );
      return false;
    }
    return true;
  }

  private validateLogLevel(level: string): boolean {
    const validLevels = ['error', 'warn', 'info', 'debug'];
    if (!validLevels.includes(level)) {
      this.addError(
        ConfigErrorCode.INVALID_VAR_VALUE,
        ConfigErrorMessages[ConfigErrorCode.INVALID_VAR_VALUE]('LOG_LEVEL', level, 'Must be one of: error, warn, info, debug'),
        'LOG_LEVEL',
        'error | warn | info | debug',
        level
      );
      return false;
    }
    return true;
  }


  validateAppConfig(): Partial<FullConfig['app']> {
    const port = env.get('PORT').default(3000).asPortNumber();
    const host = env.get('HOST').default('localhost').asString();
    const environment = env.get('NODE_ENV').default('development').asString();
    const nodeEnv = env.get('NODE_ENV').default('development').asString();

    this.validatePort('PORT', port);
    this.validateEnvironment(environment);

    const corsOrigins = env.get('CORS_ORIGINS').default('*').asString().split(',');
    const corsCredentials = env.get('CORS_CREDENTIALS').default('true').asBool();

    const rateLimitWindowMs = env.get('RATE_LIMIT_WINDOW_MS').default(900000).asIntPositive(); // 15 minutes
    const rateLimitMax = env.get('RATE_LIMIT_MAX').default(100).asIntPositive();

    return {
      port,
      host,
      environment: environment as 'development' | 'staging' | 'production',
      nodeEnv,
      cors: {
        origin: corsOrigins,
        credentials: corsCredentials,
      },
      rateLimit: {
        windowMs: rateLimitWindowMs,
        max: rateLimitMax,
      },
    };
  }

  validateDatabaseConfig(): Partial<FullConfig['database']> {
    const host = env.get('DB_HOST').default('localhost').asString();
    const port = env.get('DB_PORT').default(5432).asPortNumber();
    const username = env.get('DB_USERNAME').required().asString();
    const password = env.get('DB_PASSWORD').required().asString();
    const database = env.get('DB_NAME').required().asString();
    const ssl = env.get('DB_SSL').default('false').asBool();
    const poolSize = env.get('DB_POOL_SIZE').default(10).asIntPositive();
    const connectionTimeout = env.get('DB_CONNECTION_TIMEOUT').default(30000).asIntPositive();
    const idleTimeout = env.get('DB_IDLE_TIMEOUT').default(30000).asIntPositive();

    this.validateRequired('DB_USERNAME', username);
    this.validateRequired('DB_PASSWORD', password);
    this.validateRequired('DB_NAME', database);
    this.validatePort('DB_PORT', port);

    return {
      host,
      port,
      username,
      password,
      database,
      ssl,
      poolSize,
      connectionTimeout,
      idleTimeout,
    };
  }


  validateLoggingConfig(): Partial<FullConfig['logging']> {
    const level = env.get('LOG_LEVEL').default('info').asString();
    const enableConsole = env.get('LOG_ENABLE_CONSOLE').default('true').asBool();

    this.validateLogLevel(level);

    return {
      level: level as 'error' | 'warn' | 'info' | 'debug',
      enableConsole,
    };
  }

  validateSecurityConfig(): Partial<FullConfig['security']> {
    const enableHelmet = env.get('ENABLE_HELMET').default('true').asBool();
    const enableCors = env.get('ENABLE_CORS').default('true').asBool();
    const trustedProxies = env.get('TRUSTED_PROXIES').default('').asString().split(',').filter(Boolean);

    return {
      enableHelmet,
      enableCors,
      trustedProxies,
    };
  }

  validateMonitoringConfig(): Partial<FullConfig['monitoring']> {
    const enableHealthCheck = env.get('ENABLE_HEALTH_CHECK').default('true').asBool();
    const healthCheckPath = env.get('HEALTH_CHECK_PATH').default('/health').asString();

    return {
      enableHealthCheck,
      healthCheckPath,
    };
  }


  validateAll(): FullConfig {
    const app = this.validateAppConfig();
    const database = this.validateDatabaseConfig();
    const logging = this.validateLoggingConfig();
    const security = this.validateSecurityConfig();
    const monitoring = this.validateMonitoringConfig();

    if (this.errors.length > 0) {
      throw new ConfigValidationError(this.errors);
    }

    return {
      app: app as FullConfig['app'],
      database: database as FullConfig['database'],
      logging: logging as FullConfig['logging'],
      security: security as FullConfig['security'],
      monitoring: monitoring as FullConfig['monitoring'],
    };
  }

  getErrors(): ConfigError[] {
    return this.errors;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}
