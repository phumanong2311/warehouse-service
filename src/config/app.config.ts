import { config } from 'dotenv';
import * as env from 'env-var';

config();

export const appConfig = {
  app: {
    port: env.get('PORT').required().asPortNumber(),
  },
};
