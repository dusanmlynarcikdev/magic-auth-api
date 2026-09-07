import { eq } from 'drizzle-orm';
import Authentication from '../../src/app.authentication.js';
import AuthenticationRepository from '../../src/app.authentication.repository.js';
import { db } from '../../src/database.index.js';
import { authentications } from '../../src/database.schema.js';

const authenticated = (userExternalId: string, now: Date) => {
  const authentication = Authentication.create(userExternalId, now);
  authentication.authenticate(now);

  return authentication;
};

describe('AuthenticationRepository', () => {
  const now = new Date('2026-09-04T12:30:45.000Z');
  const repository = new AuthenticationRepository();

  describe('findOneUnexpiredByMagicToken', () => {
    it('expired', async () => {
      const authentication = Authentication.create('user-1', now);
      await repository.add(authentication);

      const result = await repository.findOneUnexpiredByMagicToken(
        authentication.magicToken!,
        new Date('2026-09-04T12:40:46.000Z'),
      );

      expect(result).toBeNull();
    });

    it('another token', async () => {
      await repository.add(Authentication.create('user-1', now));

      const result = await repository.findOneUnexpiredByMagicToken(
        'unknown',
        now,
      );

      expect(result).toBeNull();
    });
  });

  describe('findOneUnexpiredByToken', () => {
    it('expired', async () => {
      const authentication = authenticated('user-1', now);
      await repository.add(authentication);

      const result = await repository.findOneUnexpiredByToken(
        authentication.token!,
        new Date('2026-10-04T12:30:46.000Z'),
      );

      expect(result).toBeNull();
    });

    it('another token', async () => {
      await repository.add(authenticated('user-1', now));

      const result = await repository.findOneUnexpiredByToken('unknown', now);

      expect(result).toBeNull();
    });
  });

  describe('findUnexpiredWithTokenByUserExternalId', () => {
    it('newest first', async () => {
      const first = authenticated('user-1', now);
      const second = authenticated('user-1', now);
      await repository.add(first);
      await repository.add(second);

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        now,
      );

      expect(result.map(({ id }) => id)).toStrictEqual([second.id, first.id]);
    });

    it('expired', async () => {
      await repository.add(authenticated('user-1', now));

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        new Date('2026-10-04T12:30:46.000Z'),
      );

      expect(result).toHaveLength(0);
    });

    it('without token', async () => {
      await repository.add(Authentication.create('user-1', now));

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        now,
      );

      expect(result).toHaveLength(0);
    });

    it('another user', async () => {
      await repository.add(authenticated('user-1', now));

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-2',
        now,
      );

      expect(result).toHaveLength(0);
    });
  });

  it('remove:another authentication is not deleted', async () => {
    const authentication1 = Authentication.create('user-1', now);
    const authentication2 = Authentication.create('user-1', now);
    await repository.add(authentication1);
    await repository.add(authentication2);

    await repository.remove(authentication1);

    const authenticationsRepository = await db.select().from(authentications);
    expect(authenticationsRepository).toHaveLength(1);
    expect(authenticationsRepository[0].id).toBe(authentication2.id);
  });

  it('removeExpired:unexpired', async () => {
    const authentication = Authentication.create('user-1', now);
    await repository.add(authentication);

    await repository.removeExpired(now);

    const authenticationsRepository = await db.select().from(authentications);
    expect(authenticationsRepository).toHaveLength(1);
    expect(authenticationsRepository[0].id).toBe(authentication.id);
  });

  it('update:another authentication is not updated', async () => {
    const authentication1 = Authentication.create('user-1', now);
    const authentication2 = Authentication.create('user-1', now);
    await repository.add(authentication1);
    await repository.add(authentication2);

    authentication1.authenticate(now);

    await repository.update(authentication1);

    const [authentication2Repository] = await db
      .select()
      .from(authentications)
      .where(eq(authentications.id, authentication2.id));

    expect(authentication2Repository).toStrictEqual({
      id: authentication2.id,
      userExternalId: authentication2.userExternalId,
      magicToken: authentication2.magicToken,
      token: null,
      authenticatedAt: null,
      expiresAt: authentication2.expiresAt,
    });
  });
});
