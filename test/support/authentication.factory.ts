import Authentication from '../../src/authentication.js';

export default class AuthenticationFactory {
  static readonly NOW = new Date('2026-09-04T12:30:45.000Z');
  static readonly TOKEN_REGEX = /^[\w-]{43}$/;

  static authenticated(): Authentication {
    const authentication = AuthenticationFactory.create();
    authentication.authenticate(AuthenticationFactory.NOW);

    return authentication;
  }

  static create(): Authentication {
    return Authentication.create('user-1', AuthenticationFactory.NOW);
  }
}
