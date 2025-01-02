import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationException extends BaseException {
  constructor(errors: string[]) {
    super(
      `Validation failed: ${errors.join(', ')}`,
      'VALIDATION_ERROR',
      HttpStatus.BAD_REQUEST,
    );
  }
}
