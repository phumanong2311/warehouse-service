export interface DatabaseConfig {
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

export interface AppConfig {
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

export interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  enableConsole: boolean;
}

export interface SecurityConfig {
  enableHelmet: boolean;
  enableCors: boolean;
  trustedProxies: string[];
}

export interface MonitoringConfig {
  enableHealthCheck: boolean;
  healthCheckPath: string;
}

export interface FullConfig {
  app: AppConfig;
  database: DatabaseConfig;
  logging: LoggingConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
}
