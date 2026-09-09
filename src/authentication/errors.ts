import { GoneException, NotFoundException } from '@nestjs/common';

export class AuthenticationExpiredError extends GoneException {
  constructor() {
    super('Authentication expired');
  }
}

export class AuthenticationNotFoundError extends NotFoundException {
  constructor() {
    super('Authentication not found');
  }
}
