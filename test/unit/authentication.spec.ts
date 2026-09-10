import Authentication from '../../src/authentication/entity.js';
import { AuthenticationExpiredError } from '../../src/authentication/errors.js';
import type { AuthenticationRow } from '../../src/database/schema.js';
import AuthenticationFactory from '../support/authentication/factory.js';

describe('Authentication', () => {
  const now = AuthenticationFactory.NOW;
  const token = 'token-1';

  it('create', () => {
    const authentication = Authentication.create('user-1', token, now);

    expect(authentication.userExternalId).toBe('user-1');
    expect(authentication.magicToken).toBe(token);
    expect(authentication.token).toBeNull();
    expect(authentication.authenticatedAt).toBeNull();
    expect(authentication.expiresAt).toStrictEqual(
      new Date('2026-09-04T12:40:45.000Z'),
    );
  });

  describe('authenticate', () => {
    it('success', () => {
      const authentication = AuthenticationFactory.create();

      authentication.authenticate(token, now);

      expect(authentication.magicToken).toBeNull();
      expect(authentication.token).toBe(token);
      expect(authentication.authenticatedAt).toBe(now);
      expect(authentication.expiresAt).toStrictEqual(
        new Date('2026-10-04T12:30:45.000Z'),
      );
    });

    it('already authenticated', () => {
      const authentication = AuthenticationFactory.create();
      authentication.authenticate(token, now);

      expect(() => authentication.authenticate(token, now)).toThrow(
        'Authentication already authenticated',
      );
    });

    it('expired', () => {
      const authentication = AuthenticationFactory.create();

      expect(() =>
        authentication.authenticate(
          token,
          new Date('2026-09-04T12:40:45.001Z'),
        ),
      ).toThrow(AuthenticationExpiredError);
    });
  });

  describe('isExpired', () => {
    it('expired', () => {
      const authentication = AuthenticationFactory.create();

      expect(
        authentication.isExpired(new Date('2026-09-04T12:40:45.001Z')),
      ).toBe(true);
    });

    it.each([
      new Date('2026-09-04T12:40:45.000Z'),
      new Date('2026-09-04T12:40:44.999Z'),
    ])('unexpired at %s', (now) => {
      const authentication = AuthenticationFactory.create();

      expect(authentication.isExpired(now)).toBe(false);
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
      authentication.authenticate('token-1', now);

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
