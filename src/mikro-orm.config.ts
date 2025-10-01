import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { resolve } from 'path';
import {
  Inventory,
  Rack,
  Warehouse,
} from './infra/postgresql/entities';

export default defineConfig({
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME || 'warehouse_db',
  user: process.env.DB_USERNAME || 'warehouse_user',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  debug: true,
  pool: { min: 5, max: 10 },
  entities: [
    Warehouse,
    Inventory,
    Rack,
  ],
  logger: async function (message: string) {
    console.log(message);
  },
  seeder: {
    path: resolve(__dirname, './infra/postgresql/seed'),
  },
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
  metadataProvider: TsMorphMetadataProvider,
});
