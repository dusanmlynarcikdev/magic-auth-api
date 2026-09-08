export abstract class AuthenticationError extends Error {}

export class AuthenticationAlreadyAuthenticatedError extends AuthenticationError {
  constructor() {
    super('Authentication already authenticated');
  }
}

export class AuthenticationExpiredError extends AuthenticationError {
  constructor() {
    super('Authentication expired');
  }
}

export class AuthenticationNotFoundError extends AuthenticationError {
  constructor() {
    super('Authentication not found');
  }
}
