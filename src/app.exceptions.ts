export class AuthenticationAlreadyAuthenticatedError extends Error {
  constructor() {
    super('Authentication already authenticated');
  }
}

export class AuthenticationExpiredError extends Error {
  constructor() {
    super('Authentication expired');
  }
}
