import Authentication from '../../src/authentication/entity.js';
import {
  AuthenticationAlreadyAuthenticatedError,
  AuthenticationExpiredError,
} from '../../src/authentication/errors.js';
import type { AuthenticationRow } from '../../src/database.schema.js';
import AuthenticationFactory from '../support/authentication.factory.js';

describe('Authentication', () => {
  const now = AuthenticationFactory.NOW;

  it('create', () => {
    const authentication = AuthenticationFactory.create();

    expect(authentication.userExternalId).toBe('user-1');
    expect(authentication.magicToken).toMatch(
      AuthenticationFactory.TOKEN_REGEX,
    );
    expect(authentication.token).toBeNull();
    expect(authentication.authenticatedAt).toBeNull();
    expect(authentication.expiresAt).toStrictEqual(
      new Date('2026-09-04T12:40:45.000Z'),
    );
  });

  describe('authenticate', () => {
    it('success', () => {
      const authentication = AuthenticationFactory.create();

      authentication.authenticate(now);

      expect(authentication.magicToken).toBeNull();
      expect(authentication.token).toMatch(AuthenticationFactory.TOKEN_REGEX);
      expect(authentication.authenticatedAt).toBe(now);
      expect(authentication.expiresAt).toStrictEqual(
        new Date('2026-10-04T12:30:45.000Z'),
      );
    });

    it('already authenticated', () => {
      const authentication = AuthenticationFactory.create();
      authentication.authenticate(now);

      expect(() => authentication.authenticate(now)).toThrow(
        AuthenticationAlreadyAuthenticatedError,
      );
    });

    it('expired', () => {
      const authentication = AuthenticationFactory.create();

      expect(() =>
        authentication.authenticate(new Date('2026-09-04T12:40:45.001Z')),
      ).toThrow(AuthenticationExpiredError);
    });
  });

  describe('checkExpiration', () => {
    it('expired', () => {
      const authentication = AuthenticationFactory.create();

      expect(() =>
        authentication.checkExpiration(new Date('2026-09-04T12:40:45.001Z')),
      ).toThrow(AuthenticationExpiredError);
    });

    it.each([
      new Date('2026-09-04T12:40:45.000Z'),
      new Date('2026-09-04T12:40:44.999Z'),
    ])('unexpired at %s', (now) => {
      const authentication = AuthenticationFactory.create();

      expect(() => authentication.checkExpiration(now)).not.toThrow();
    });
  });

  describe('toRow', () => {
    it('unauthenticated', () => {
      const authentication = AuthenticationFactory.create();

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
      const authentication = AuthenticationFactory.create();
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
