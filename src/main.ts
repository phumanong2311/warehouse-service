import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@share/exceptions/all-exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Warehouse Service is running on port ${port}`);
  // Áp dụng Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());
}
bootstrap();
