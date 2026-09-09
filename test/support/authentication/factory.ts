import Authentication from '../../../src/authentication/entity.js';

export default class AuthenticationFactory {
  static readonly NOW = new Date('2026-09-04T12:30:45.000Z');

  static authenticated(
    token: string = 'token-1',
    now: Date = AuthenticationFactory.NOW,
  ): Authentication {
    const authentication = AuthenticationFactory.create(undefined, now);

    authentication.authenticate(token, now);

    return authentication;
  }

  static create(
    magicToken: string = 'magic-token-1',
    now: Date = AuthenticationFactory.NOW,
  ): Authentication {
    return Authentication.create('user-1', magicToken, now);
  }
}
