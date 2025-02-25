import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@share/exceptions/all-exceptions.filter';
import { AppModule } from './app.module';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('process.env.PORT', appConfig.app.port);
  await app.listen(appConfig.app.port);
  // Áp dụng Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());
}
bootstrap();
