import Authentication from '../src/app.authentication.js';
import {
  AuthenticationAlreadyAuthenticatedError,
  AuthenticationExpiredError,
} from '../src/app.exceptions.js';

describe('Authentication', () => {
  const now = new Date('2026-09-04T12:30:45.000Z');

  it('create', () => {
    const authentication = new Authentication('user-1', now);

    expect(authentication.userExternalId).toStrictEqual('user-1');
    expect(authentication.magicToken).toBeTypeOf('string');
    expect(authentication.token).toBeNull();
    expect(authentication.authenticatedAt).toBeNull();
    expect(authentication.expiresAt.toISOString()).toStrictEqual(
      '2026-09-04T12:40:45.000Z',
    );
  });

  it('authenticate', () => {
    const authentication = new Authentication('user-1', now);

    authentication.authenticate(now);

    expect(authentication.magicToken).toBeNull();
    expect(authentication.token).toBeTypeOf('string');
    expect(authentication.authenticatedAt).toStrictEqual(now);
    expect(authentication.expiresAt.toISOString()).toStrictEqual(
      '2026-10-04T12:30:45.000Z',
    );
  });

  it('already authenticated', () => {
    const authentication = new Authentication('user-1', now);
    authentication.authenticate(now);

    expect(() => authentication.authenticate(now)).toThrow(
      AuthenticationAlreadyAuthenticatedError,
    );
  });

  it('expired', () => {
    const authentication = new Authentication('user-1', now);

    expect(() =>
      authentication.authenticate(new Date('2026-09-04T12:40:45.001Z')),
    ).toThrow(AuthenticationExpiredError);
  });
});
