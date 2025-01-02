import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroConfigModule } from './infra/postgresql/mikro/mikro.module';
import { ConfigModule } from '@nestjs/config';
import { CustomRouterModule } from './router';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroConfigModule,
    CustomRouterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
