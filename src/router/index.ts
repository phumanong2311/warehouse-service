import { DynamicModule, Module } from '@nestjs/common';
import { PublicRouter } from './public-routers';

@Module({})
export class CustomRouterModule {
  static forRoot(): DynamicModule {
    return {
      module: CustomRouterModule,
      imports: [PublicRouter],
    };
  }
}
