import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import Authentication from '../../../src/authentication/entity.js';
import { AuthenticationExpiredError } from '../../../src/authentication/errors.js';
import AuthenticationGuard, {
  type AuthenticatedRequest,
} from '../../../src/authentication/guard.js';
import AuthenticationRepository from '../../../src/authentication/repository.js';
import AuthenticationFactory from '../../support/authentication/factory.js';
import ClockProvider from '../../../src/clock.provider.js';
import TokenProvider from '../../../src/token.provider.js';

describe('AuthenticationGuard', () => {
  const repository = new AuthenticationRepository();
  const tokenProvider = new TokenProvider();

  const createGuard = (now: Date = AuthenticationFactory.NOW) =>
    new AuthenticationGuard(
      repository,
      { now: () => now } satisfies ClockProvider,
      tokenProvider,
    );

  const createContext = (authorization?: string) => {
    const request = {
      headers: authorization ? { authorization } : {},
    } as AuthenticatedRequest;

    return {
      request,
      context: {
        switchToHttp: () => ({ getRequest: () => request }),
      } as unknown as ExecutionContext,
    };
  };

  const addAuthenticated = async (): Promise<[string, Authentication]> => {
    const token = tokenProvider.generate();
    const authentication = AuthenticationFactory.authenticated(
      tokenProvider.hash(token),
    );
    await repository.add(authentication);

    return [token, authentication];
  };

  const expectUnauthorized = async (
    promise: Promise<boolean>,
    message: string,
  ) => {
    await expect(promise).rejects.toThrow(UnauthorizedException);
    await expect(promise).rejects.toThrow(message);
  };

  it.each(['Bearer', 'bearer'])('authenticated:scheme %s', async (scheme) => {
    const [token, authentication] = await addAuthenticated();
    const { context, request } = createContext(`${scheme} ${token}`);

    await expect(createGuard().canActivate(context)).resolves.toBe(true);

    expect(request.authentication.id).toBe(authentication.id);
  });

  it.each([
    ['missing header', undefined],
    ['another scheme', 'Basic token-1'],
    ['scheme only', 'Bearer'],
    ['token only', 'token-1'],
  ])('invalid Authorization header:%s', async (_name, authorization) => {
    const { context } = createContext(authorization);

    await expectUnauthorized(
      createGuard().canActivate(context),
      'Missing or invalid Authorization header',
    );
  });

  it('unknown token', async () => {
    await addAuthenticated();
    const { context } = createContext('Bearer token-2');

    await expectUnauthorized(
      createGuard().canActivate(context),
      'Unauthorized',
    );
  });

  it('authentication expired', async () => {
    const [token] = await addAuthenticated();
    const { context } = createContext(`Bearer ${token}`);
    const guard = createGuard(new Date('2026-11-04T12:30:45.000Z'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      AuthenticationExpiredError,
    );
  });
});
