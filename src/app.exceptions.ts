export class AuthenticationAlreadyAuthenticatedError extends Error {
  constructor() {
    super('Authentication has already been authenticated');
  }
}

export class AuthenticationExpiredError extends Error {
  constructor() {
    super('Authentication expired');
  }
}
