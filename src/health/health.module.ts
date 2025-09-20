import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigHealthIndicator } from './config.health';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [ConfigHealthIndicator],
  exports: [ConfigHealthIndicator],
})
export class HealthModule {}
