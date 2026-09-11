import AuthenticationDeleteExpiredTask from '../../../../src/authentication/delete/expired/task.js';
import AuthenticationDeleteExpiredUseCase from '../../../../src/authentication/delete/expired/use-case.js';
import AuthenticationRepository from '../../../../src/authentication/repository.js';
import ClockProvider from '../../../../src/clock.provider.js';
import AuthenticationFactory from '../../../support/authentication/factory.js';
import AuthenticationQuery from '../../../support/authentication/query.js';

describe('AuthenticationDeleteExpiredTask', () => {
  const repository = new AuthenticationRepository();
  const useCase = new AuthenticationDeleteExpiredUseCase(repository, {
    now: () => new Date('2026-09-04T12:40:46.000Z'),
  } satisfies ClockProvider);
  const task = new AuthenticationDeleteExpiredTask(useCase);

  it('delete', async () => {
    await repository.add(AuthenticationFactory.create());

    await task.execute();

    expect(await AuthenticationQuery.findAll()).toHaveLength(0);
  });
});
