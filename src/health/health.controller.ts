import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { ConfigHealthIndicator } from './config.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly configHealthIndicator: ConfigHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.configHealthIndicator.isHealthy('config'),
      () => this.configHealthIndicator.checkDatabaseConfig('database-config'),
      () => this.configHealthIndicator.checkSecurityConfig('security-config'),
    ]);
  }

  @Get('config')
  @HealthCheck()
  async checkConfig(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.configHealthIndicator.isHealthy('config'),
    ]);
  }

  @Get('database')
  @HealthCheck()
  async checkDatabase(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.configHealthIndicator.checkDatabaseConfig('database-config'),
    ]);
  }

  @Get('security')
  @HealthCheck()
  async checkSecurity(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.configHealthIndicator.checkSecurityConfig('security-config'),
    ]);
  }
}
