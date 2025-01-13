import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import {
  Category,
  Inventory,
  Product,
  Rack,
  Size,
  Variant,
  VariantType,
  VariantValue,
  Warehouse,
} from '../entities';
import mikroConfig from './mikro.config';

@Module({
  imports: [
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
            Size,
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
