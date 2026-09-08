import Authentication from '../src/app.authentication.js';

export default class AuthenticationGenerator {
  private static NOW = new Date('2026-09-04T12:30:45.000Z');

  static authenticated(): Authentication {
    const authentication = AuthenticationGenerator.generate();
    authentication.authenticate(AuthenticationGenerator.NOW);

    return authentication;
  }

  static generate(): Authentication {
    return Authentication.create('user-1', AuthenticationGenerator.NOW);
  }
}
