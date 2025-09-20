import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@share/exceptions/all-exceptions.filter';
import { AppModule } from './app.module';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(appConfig.app.port);
  console.log(`Warehouse Service is running on port ${appConfig.app.port}`);
  // Áp dụng Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());
}
bootstrap();
