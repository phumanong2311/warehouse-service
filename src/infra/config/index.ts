import { postgresqlConfig } from './postgresql';
import * as dotenv from 'dotenv';
dotenv.config();

const configuration = {
  port: parseInt(process.env.PORT, 10),
  postgresql: { ...postgresqlConfig },
};
export default configuration;
