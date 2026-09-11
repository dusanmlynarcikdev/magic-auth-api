import { type ExecutionContext, UnauthorizedException } from '@nestjs/common';

import AuthenticationGuard, {
  type AuthenticatedRequest,
} from '../../../src/authentication/guard.js';
import AuthenticationRepository from '../../../src/authentication/repository.js';
import type ClockProvider from '../../../src/clock.provider.js';
import TokenProvider from '../../../src/token.provider.js';
import AuthenticationFactory from '../../support/authentication/factory.js';

describe('AuthenticationGuard', () => {
  const clockProvider = {
    now: () => AuthenticationFactory.NOW,
  } satisfies ClockProvider;
  const repository = new AuthenticationRepository();
  const tokenProvider = new TokenProvider();
  const guard = new AuthenticationGuard(
    repository,
    clockProvider,
    tokenProvider,
  );

  it.each(['Bearer', 'bearer'])('authenticated scheme: %s', async (scheme) => {
    const authentication = AuthenticationFactory.authenticated(
      tokenProvider.hash('token-1'),
    );
    await repository.add(authentication);
    const context = createContext(`${scheme} token-1`);

    await expect(guard.canActivate(context)).resolves.toBe(true);

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    expect(request.authentication.id).toBe(authentication.id);
  });

  it('authentication expired', async () => {
    await repository.add(
      AuthenticationFactory.authenticated(
        tokenProvider.hash('token-1'),
        new Date('2026-08-04T12:30:45.000Z'),
      ),
    );

    await expectUnauthorized(
      guard.canActivate(createContext('Bearer token-1')),
    );
  });

  it('unknown token', async () => {
    await repository.add(AuthenticationFactory.authenticated());

    await expectUnauthorized(
      guard.canActivate(createContext('Bearer token-2')),
    );
  });

  it.each([
    ['missing header', undefined],
    ['another scheme', 'Basic token-1'],
    ['scheme only', 'Bearer'],
    ['token only', 'token-1'],
  ])('invalid Authorization header: %s', (_name, authorization) =>
    expectUnauthorized(
      guard.canActivate(createContext(authorization)),
      'Missing or invalid Authorization header',
    ),
  );
});

const createContext = (authorization?: string): ExecutionContext => {
  const request = { headers: { authorization } };

  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
};

const expectUnauthorized = async (
  promise: Promise<boolean>,
  message: string = 'Unauthorized',
) => {
  await expect(promise).rejects.toThrow(UnauthorizedException);
  await expect(promise).rejects.toThrow(message);
};
