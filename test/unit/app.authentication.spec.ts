import Authentication from '../../src/app.authentication.js';
import {
  AuthenticationAlreadyAuthenticatedError,
  AuthenticationExpiredError,
} from '../../src/app.exceptions.js';
import type { AuthenticationRow } from '../../src/database.schema.js';
import AuthenticationGenerator from '../authentication-generator.js';

const TOKEN_REGEX = /^[\w-]{43}$/;

describe('Authentication', () => {
  const now = new Date('2026-09-04T12:30:45.000Z');

  it('create', () => {
    const authentication = AuthenticationGenerator.generate();

    expect(authentication.userExternalId).toBe('user-1');
    expect(authentication.magicToken).toMatch(TOKEN_REGEX);
    expect(authentication.token).toBeNull();
    expect(authentication.authenticatedAt).toBeNull();
    expect(authentication.expiresAt).toStrictEqual(
      new Date('2026-09-04T12:40:45.000Z'),
    );
  });

  it('authenticate', () => {
    const authentication = AuthenticationGenerator.generate();

    authentication.authenticate(now);

    expect(authentication.magicToken).toBeNull();
    expect(authentication.token).toMatch(TOKEN_REGEX);
    expect(authentication.authenticatedAt).toBe(now);
    expect(authentication.expiresAt).toStrictEqual(
      new Date('2026-10-04T12:30:45.000Z'),
    );
  });

  it('already authenticated', () => {
    const authentication = AuthenticationGenerator.generate();
    authentication.authenticate(now);

    expect(() => authentication.authenticate(now)).toThrow(
      AuthenticationAlreadyAuthenticatedError,
    );
  });

  it('expired', () => {
    const authentication = AuthenticationGenerator.generate();

    expect(() =>
      authentication.authenticate(new Date('2026-09-04T12:40:45.001Z')),
    ).toThrow(AuthenticationExpiredError);
  });

  describe('toRow', () => {
    it('unauthenticated', () => {
      const authentication = AuthenticationGenerator.generate();

      expect(authentication.toRow()).toStrictEqual({
        id: authentication.id,
        userExternalId: authentication.userExternalId,
        magicToken: authentication.magicToken,
        token: null,
        authenticatedAt: null,
        expiresAt: authentication.expiresAt,
      });
    });

    it('authenticated', () => {
      const authentication = AuthenticationGenerator.generate();
      authentication.authenticate(now);

      expect(authentication.toRow()).toStrictEqual({
        id: authentication.id,
        userExternalId: authentication.userExternalId,
        magicToken: null,
        token: authentication.token,
        authenticatedAt: now,
        expiresAt: authentication.expiresAt,
      });
    });
  });

  it('fromRow', () => {
    const row: AuthenticationRow = {
      id: '00000000-0000-0000-0000-000000000000',
      userExternalId: 'user-1',
      magicToken: 'magic-token-1',
      token: 'token-1',
      authenticatedAt: now,
      expiresAt: new Date('2026-09-04T12:30:45.001Z'),
    };

    const authentication = Authentication.fromRow(row);

    expect(authentication.id).toBe(row.id);
    expect(authentication.userExternalId).toBe(row.userExternalId);
    expect(authentication.magicToken).toBe(row.magicToken);
    expect(authentication.token).toBe(row.token);
    expect(authentication.authenticatedAt).toBe(row.authenticatedAt);
    expect(authentication.expiresAt).toBe(row.expiresAt);
  });
});
