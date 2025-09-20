import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mikroConfig from '../../../mikro-orm.config';
import {
  Inventory,
  Rack,
  Warehouse,
} from '../entities';

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
            Inventory,
            Rack,
          ],
        };
      },
    }),
  ],
  exports: [MikroOrmModule],
})
export class MikroConfigModule {}
