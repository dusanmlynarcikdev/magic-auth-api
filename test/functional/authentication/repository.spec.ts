import Authentication from '../../../src/authentication/entity.js';
import AuthenticationFactory from '../../support/authentication.factory.js';
import AuthenticationRepository from '../../../src/authentication/repository.js';
import { AuthenticationNotFoundError } from '../../../src/authentication/errors.js';
import AuthenticationQuery from '../../support/authentication.query.js';

const expectNotFound = (promise: Promise<Authentication>) =>
  expect(promise).rejects.toThrow(AuthenticationNotFoundError);

describe('AuthenticationRepository', () => {
  const now = AuthenticationFactory.NOW;
  const repository = new AuthenticationRepository();

  describe('get', () => {
    const id = '00000000-0000-0000-0000-000000000000';

    it('another id', async () => {
      await repository.add(AuthenticationFactory.create());

      await expectNotFound(repository.get(id));
    });

    it('empty database', () => expectNotFound(repository.get(id)));
  });

  describe('getByMagicToken', () => {
    it('another token', async () => {
      await repository.add(AuthenticationFactory.create());

      await expectNotFound(repository.getByMagicToken('magic-token-1'));
    });

    it('empty database', () =>
      expectNotFound(repository.getByMagicToken('magic-token-1')));
  });

  describe('getByToken', () => {
    it('another token', async () => {
      await repository.add(AuthenticationFactory.authenticated());

      await expectNotFound(repository.getByToken('token-1'));
    });

    it('empty database', () =>
      expectNotFound(repository.getByToken('token-1')));
  });

  describe('findUnexpiredWithTokenByUserExternalId', () => {
    it('newest first', async () => {
      const first = AuthenticationFactory.authenticated();
      const second = AuthenticationFactory.authenticated();
      await repository.add(first);
      await repository.add(second);

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        now,
      );

      expect(result.map(({ id }) => id)).toStrictEqual([second.id, first.id]);
    });

    it('expired', async () => {
      await repository.add(AuthenticationFactory.authenticated());

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        new Date('2026-10-04T12:30:46.000Z'),
      );

      expect(result).toHaveLength(0);
    });

    it('without token', async () => {
      await repository.add(AuthenticationFactory.create());

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-1',
        now,
      );

      expect(result).toHaveLength(0);
    });

    it('another user', async () => {
      await repository.add(AuthenticationFactory.authenticated());

      const result = await repository.findUnexpiredWithTokenByUserExternalId(
        'user-2',
        now,
      );

      expect(result).toHaveLength(0);
    });
  });

  it('remove:another authentication is not deleted', async () => {
    const authentication1 = AuthenticationFactory.create();
    const authentication2 = AuthenticationFactory.create();
    await repository.add(authentication1);
    await repository.add(authentication2);

    await repository.remove(authentication1);

    const authenticationRows = await AuthenticationQuery.findAll();
    expect(authenticationRows).toHaveLength(1);
    expect(authenticationRows[0].id).toBe(authentication2.id);
  });

  it('removeExpired:unexpired', async () => {
    const authentication = AuthenticationFactory.create();
    await repository.add(authentication);

    await repository.removeExpired(now);

    const authenticationRows = await AuthenticationQuery.findAll();
    expect(authenticationRows).toHaveLength(1);
    expect(authenticationRows[0].id).toBe(authentication.id);
  });

  it('update:another authentication is not updated', async () => {
    const authentication1 = AuthenticationFactory.create();
    const authentication2 = AuthenticationFactory.create();
    await repository.add(authentication1);
    await repository.add(authentication2);

    authentication1.authenticate(now);

    await repository.update(authentication1);

    const _authentication2 = await repository.get(authentication2.id);

    expect(_authentication2).toStrictEqual(authentication2);
  });
});
