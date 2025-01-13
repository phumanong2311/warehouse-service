import { NotFoundError, ValidationError } from '@mikro-orm/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
    } else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message || 'Validation failed';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log lỗi (tích hợp Winston hoặc Sentry nếu cần)
    console.error(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
