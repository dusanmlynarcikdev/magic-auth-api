import { eq } from 'drizzle-orm';
import Authentication from '../../src/app.authentication.js';
import AuthenticationGenerator from '../authentication-generator.js';
import AuthenticationRepository from '../../src/app.authentication.repository.js';
import { AuthenticationNotFoundError } from '../../src/app.exceptions.js';
import { db } from '../../src/database.index.js';
import { authentications } from '../../src/database.schema.js';

const expectNotFound = (promise: Promise<Authentication>) =>
  expect(promise).rejects.toThrow(AuthenticationNotFoundError);

describe('AuthenticationRepository', () => {
  const now = new Date('2026-09-04T12:30:45.000Z');
  const repository = new AuthenticationRepository();

  describe('get', () => {
    const id = '00000000-0000-0000-0000-000000000000';

    it('another id', async () => {
      await repository.add(AuthenticationGenerator.generate());

      await expectNotFound(repository.get(id));
    });

    it('empty database', () => expectNotFound(repository.get(id)));
  });

  describe('getByMagicToken', () => {
    it('another token', async () => {
      await repository.add(AuthenticationGenerator.generate());

      await expectNotFound(repository.getByMagicToken('magic-token-1'));
    });

    it('empty database', () =>
      expectNotFound(repository.getByMagicToken('magic-token-1')));
  });

  describe('getByToken', () => {
    it('another token', async () => {
      await repository.add(AuthenticationGenerator.authenticated());

      await expectNotFound(repository.getByToken('token-1'));
    });

    it('empty database', () =>
      expectNotFound(repository.getByToken('token-1')));
  });

  describe('findUnexpiredWithTokenByUserExternalId', () => {
    it('newest first', async () => {
      const first = AuthenticationGenerator.authenticated();
      const second = AuthenticationGenerator.authenticated();
      await repository.add(first);
      await repository.add(second);

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        now,
      );

      expect(result.map(({ id }) => id)).toStrictEqual([second.id, first.id]);
    });

    it('expired', async () => {
      await repository.add(AuthenticationGenerator.authenticated());

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        new Date('2026-10-04T12:30:46.000Z'),
      );

      expect(result).toHaveLength(0);
    });

    it('without token', async () => {
      await repository.add(AuthenticationGenerator.generate());

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        now,
      );

      expect(result).toHaveLength(0);
    });

    it('another user', async () => {
      await repository.add(AuthenticationGenerator.authenticated());

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-2',
        now,
      );

      expect(result).toHaveLength(0);
    });
  });

  it('remove:another authentication is not deleted', async () => {
    const authentication1 = AuthenticationGenerator.generate();
    const authentication2 = AuthenticationGenerator.generate();
    await repository.add(authentication1);
    await repository.add(authentication2);

    await repository.remove(authentication1);

    const authenticationsRepository = await db.select().from(authentications);
    expect(authenticationsRepository).toHaveLength(1);
    expect(authenticationsRepository[0].id).toBe(authentication2.id);
  });

  it('removeExpired:unexpired', async () => {
    const authentication = AuthenticationGenerator.generate();
    await repository.add(authentication);

    await repository.removeExpired(now);

    const authenticationsRepository = await db.select().from(authentications);
    expect(authenticationsRepository).toHaveLength(1);
    expect(authenticationsRepository[0].id).toBe(authentication.id);
  });

  it('update:another authentication is not updated', async () => {
    const authentication1 = AuthenticationGenerator.generate();
    const authentication2 = AuthenticationGenerator.generate();
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
