import AuthenticationDeleteUseCase from '../../../../src/authentication/delete/use-case.js';
import AuthenticationFactory from '../../../support/authentication/factory.js';
import AuthenticationRepository from '../../../../src/authentication/repository.js';
import { AuthenticationNotFoundError } from '../../../../src/authentication/errors.js';

describe('AuthenticationDeleteUseCase', () => {
  const repository = new AuthenticationRepository();
  const useCase = new AuthenticationDeleteUseCase(repository);

  it('another user', async () => {
    const authentication = AuthenticationFactory.authenticated();
    await repository.add(authentication);

    await expect(useCase.execute(authentication.id, 'user-2')).rejects.toThrow(
      AuthenticationNotFoundError,
    );
  });
});
