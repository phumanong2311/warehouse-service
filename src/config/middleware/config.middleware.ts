import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getConfig } from '../app.config';

@Injectable()
export class ConfigMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Add configuration to request object for easy access
    req.config = getConfig();
    next();
  }
}

// Extend Express Request interface to include config
declare global {
  namespace Express {
    interface Request {
      config?: ReturnType<typeof getConfig>;
    }
  }
}
