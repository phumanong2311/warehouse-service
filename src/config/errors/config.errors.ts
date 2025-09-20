export enum ConfigErrorCode {
  MISSING_REQUIRED_VAR = 'CONFIG_001',
  INVALID_VAR_TYPE = 'CONFIG_002',
  INVALID_VAR_VALUE = 'CONFIG_003',
  INVALID_VAR_FORMAT = 'CONFIG_004',
  INVALID_ENVIRONMENT = 'CONFIG_005',
  INVALID_PORT_RANGE = 'CONFIG_006',
  INVALID_URL_FORMAT = 'CONFIG_007',
  INVALID_EMAIL_FORMAT = 'CONFIG_008',
  INVALID_DATABASE_CONFIG = 'CONFIG_009',
  INVALID_JWT_CONFIG = 'CONFIG_010',
  INVALID_REDIS_CONFIG = 'CONFIG_011',
  INVALID_FILE_STORAGE_CONFIG = 'CONFIG_012',
  INVALID_CACHE_CONFIG = 'CONFIG_013',
  INVALID_MONITORING_CONFIG = 'CONFIG_014',
  INVALID_SECURITY_CONFIG = 'CONFIG_015',
  INVALID_LOGGING_CONFIG = 'CONFIG_016',
}

export class ConfigError extends Error {
  public readonly code: ConfigErrorCode;
  public readonly variable?: string;
  public readonly expectedType?: string;
  public readonly receivedValue?: any;

  constructor(
    code: ConfigErrorCode,
    message: string,
    variable?: string,
    expectedType?: string,
    receivedValue?: any,
  ) {
    super(message);
    this.name = 'ConfigError';
    this.code = code;
    this.variable = variable;
    this.expectedType = expectedType;
    this.receivedValue = receivedValue;
  }
}


export const ConfigErrorMessages = {
  [ConfigErrorCode.MISSING_REQUIRED_VAR]: (varName: string) => 
    `Required environment variable '${varName}' is not set`,
  [ConfigErrorCode.INVALID_VAR_TYPE]: (varName: string, expected: string, received: string) => 
    `Environment variable '${varName}' should be of type ${expected}, but received ${received}`,
  [ConfigErrorCode.INVALID_VAR_VALUE]: (varName: string, value: any, constraint: string) => 
    `Environment variable '${varName}' has invalid value '${value}'. ${constraint}`,
  [ConfigErrorCode.INVALID_VAR_FORMAT]: (varName: string, format: string) => 
    `Environment variable '${varName}' has invalid format. Expected: ${format}`,
  [ConfigErrorCode.INVALID_ENVIRONMENT]: (env: string) => 
    `Invalid environment '${env}'. Must be one of: development, staging, production`,
  [ConfigErrorCode.INVALID_PORT_RANGE]: (varName: string, port: number) => 
    `Environment variable '${varName}' port ${port} is out of valid range (1-65535)`,
  [ConfigErrorCode.INVALID_URL_FORMAT]: (varName: string, url: string) => 
    `Environment variable '${varName}' has invalid URL format: ${url}`,
  [ConfigErrorCode.INVALID_EMAIL_FORMAT]: (varName: string, email: string) => 
    `Environment variable '${varName}' has invalid email format: ${email}`,
  [ConfigErrorCode.INVALID_DATABASE_CONFIG]: (message: string) => 
    `Database configuration error: ${message}`,
  [ConfigErrorCode.INVALID_JWT_CONFIG]: (message: string) => 
    `JWT configuration error: ${message}`,
  [ConfigErrorCode.INVALID_REDIS_CONFIG]: (message: string) => 
    `Redis configuration error: ${message}`,
  [ConfigErrorCode.INVALID_FILE_STORAGE_CONFIG]: (message: string) => 
    `File storage configuration error: ${message}`,
  [ConfigErrorCode.INVALID_CACHE_CONFIG]: (message: string) => 
    `Cache configuration error: ${message}`,
  [ConfigErrorCode.INVALID_MONITORING_CONFIG]: (message: string) => 
    `Monitoring configuration error: ${message}`,
  [ConfigErrorCode.INVALID_SECURITY_CONFIG]: (message: string) => 
    `Security configuration error: ${message}`,
  [ConfigErrorCode.INVALID_LOGGING_CONFIG]: (message: string) => 
    `Logging configuration error: ${message}`,
};
