import Authentication from '../../../src/authentication/entity.js';

export default class AuthenticationFactory {
  static readonly NOW = new Date('2026-09-04T12:30:45.000Z');

  static authenticated(token: string = 'token-1'): Authentication {
    const authentication = AuthenticationFactory.create();

    authentication.authenticate(token, AuthenticationFactory.NOW);

    return authentication;
  }

  static create(magicToken: string = 'magic-token-1'): Authentication {
    return Authentication.create(
      'user-1',
      magicToken,
      AuthenticationFactory.NOW,
    );
  }
}
