import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { resolve } from 'path';
import configuration from '../../config';
import { Warehouse } from '../entities';

export default defineConfig({
  driver: PostgreSqlDriver,
  dbName: configuration.postgresql.dbName,
  user: configuration.postgresql.user,
  password: configuration.postgresql.password,
  host: configuration.postgresql.host,
  port: configuration.postgresql.port,
  debug: true,
  pool: { min: 5, max: 10 },
  entities: [Warehouse],
  logger: async function (message: string) {
    console.log(message);
  },
  seeder: {
    path: resolve(__dirname, '../seed'),
  },
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
  metadataProvider: TsMorphMetadataProvider,
});
