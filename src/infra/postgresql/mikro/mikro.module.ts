import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  Category,
  Inventory,
  Product,
  Rack,
  Variant,
  VariantType,
  VariantValue,
  Warehouse,
} from '../entities';
import mikroConfig from '../../../mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: async () => {
        if (!mikroConfig)
          throw new Error('PostgreSQL connection string is not defined');
        return {
          ...mikroConfig,
          dbName: mikroConfig.dbName,
          entities: [
            Warehouse,
            Category,
            Inventory,
            Product,
            Rack,
            VariantType,
            VariantValue,
            Variant,
          ],
        };
      },
    }),
  ],
  exports: [MikroOrmModule],
})
export class MikroConfigModule {}
