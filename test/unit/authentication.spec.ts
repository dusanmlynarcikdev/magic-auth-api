import Authentication from '../../src/authentication/entity.js';
import { AuthenticationExpiredError } from '../../src/authentication/errors.js';
import type { AuthenticationRow } from '../../src/database/schema.js';
import AuthenticationFactory from '../support/authentication/factory.js';

describe('Authentication', () => {
  const now = AuthenticationFactory.NOW;
  const token = 'token-1';

  it('create', () => {
    const authentication = Authentication.create(
      'user-1',
      token,
      '/success',
      now,
    );

    expect(authentication.userExternalId).toBe('user-1');
    expect(authentication.magicToken).toBe(token);
    expect(authentication.successUrl).toBe('/success');
    expect(authentication.token).toBeNull();
    expect(authentication.userAgent).toBeNull();
    expect(authentication.authenticatedAt).toBeNull();
    expect(authentication.lastUsedAt).toBeNull();
    expect(authentication.expiresAt).toStrictEqual(
      new Date('2026-09-04T12:40:45.000Z'),
    );
  });

  describe('authenticate', () => {
    it('success', () => {
      const authentication = AuthenticationFactory.create();

      authentication.authenticate(token, 'user-agent-1', now);

      expect(authentication.magicToken).toBeNull();
      expect(authentication.successUrl).toBeNull();
      expect(authentication.token).toBe(token);
      expect(authentication.userAgent).toBe('user-agent-1');
      expect(authentication.authenticatedAt).toBe(now);
      expect(authentication.lastUsedAt).toBe(now);
      expect(authentication.expiresAt).toStrictEqual(
        new Date('2026-10-04T12:30:45.000Z'),
      );
    });

    it('already authenticated', () => {
      const authentication = AuthenticationFactory.create();
      authentication.authenticate(token, null, now);

      expect(() => authentication.authenticate(token, null, now)).toThrow(
        'Authentication already authenticated',
      );
    });

    it('expired', () => {
      const authentication = AuthenticationFactory.create();

      expect(() =>
        authentication.authenticate(
          token,
          null,
          new Date('2026-09-04T12:40:45.001Z'),
        ),
      ).toThrow(AuthenticationExpiredError);
    });
  });

  describe('updateLastUsedAt', () => {
    it('success', () => {
      const authentication = AuthenticationFactory.authenticated();
      const now = new Date('2026-09-10T08:15:30.000Z');

      authentication.updateLastUsedAt(now);

      expect(authentication.lastUsedAt).toBe(now);
    });

    it('missing last used at', () => {
      const authentication = AuthenticationFactory.create();

      expect(() => authentication.updateLastUsedAt(now)).toThrow(
        'Missing last used at',
      );
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
      const authentication = AuthenticationFactory.create(
        undefined,
        undefined,
        '/success',
      );

      expect(authentication.toRow()).toStrictEqual({
        id: authentication.id,
        userExternalId: authentication.userExternalId,
        magicToken: authentication.magicToken,
        successUrl: authentication.successUrl,
        token: null,
        userAgent: null,
        authenticatedAt: null,
        lastUsedAt: null,
        expiresAt: authentication.expiresAt,
      });
    });

    it('authenticated', () => {
      const authentication = AuthenticationFactory.create();
      authentication.authenticate('token-1', 'user-agent-1', now);

      expect(authentication.toRow()).toStrictEqual({
        id: authentication.id,
        userExternalId: authentication.userExternalId,
        magicToken: null,
        successUrl: null,
        token: authentication.token,
        userAgent: authentication.userAgent,
        authenticatedAt: now,
        lastUsedAt: now,
        expiresAt: authentication.expiresAt,
      });
    });
  });

  it('fromRow', () => {
    const row: AuthenticationRow = {
      id: '00000000-0000-0000-0000-000000000000',
      userExternalId: 'user-1',
      magicToken: 'magic-token-1',
      successUrl: '/success',
      token: 'token-1',
      userAgent: 'user-agent-1',
      authenticatedAt: now,
      lastUsedAt: new Date('2026-09-04T12:30:45.001Z'),
      expiresAt: new Date('2026-09-04T12:30:45.002Z'),
    };

    const authentication = Authentication.fromRow(row);

    expect(authentication.id).toBe(row.id);
    expect(authentication.userExternalId).toBe(row.userExternalId);
    expect(authentication.magicToken).toBe(row.magicToken);
    expect(authentication.successUrl).toBe(row.successUrl);
    expect(authentication.token).toBe(row.token);
    expect(authentication.userAgent).toBe(row.userAgent);
    expect(authentication.authenticatedAt).toBe(row.authenticatedAt);
    expect(authentication.lastUsedAt).toBe(row.lastUsedAt);
    expect(authentication.expiresAt).toBe(row.expiresAt);
  });
});
