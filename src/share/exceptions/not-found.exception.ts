import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class NotFoundException extends BaseException {
  constructor(entityName: string, id?: string) {
    const message = id
      ? `${entityName} with ID ${id} not found`
      : `${entityName} not found`;
    super(message, 'NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
