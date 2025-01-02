import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@share/exceptions/all-exceptions.filter';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  // Áp dụng Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());
}
bootstrap();
