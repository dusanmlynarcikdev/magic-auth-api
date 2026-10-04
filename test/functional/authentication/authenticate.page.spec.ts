import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';

import AuthenticationRepository from '../../../src/authentication/repository.js';
import TokenProvider from '../../../src/token.provider.js';
import { createApplication } from '../../support/application.js';
import AuthenticationFactory from '../../support/authentication/factory.js';
import AuthenticationQuery from '../../support/authentication/query.js';

describe('AuthenticationAuthenticatePage', () => {
  let app: INestApplication<App>;
  const repository = new AuthenticationRepository();
  const tokenProvider = new TokenProvider();

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it('authenticate', async () => {
    const authentication = AuthenticationFactory.create(
      tokenProvider.hash('magic-token-1'),
      undefined,
      '/success',
    );
    await repository.add(authentication);

    const response = await request(app.getHttpServer())
      .get('/authenticate?magicToken=magic-token-1')
      .set('User-Agent', 'user-agent-1')
      .expect(HttpStatus.FOUND)
      .expect('Location', '/success');

    const cookies = response.headers['set-cookie'];
    expect(cookies).toStrictEqual([
      expect.stringMatching(
        /^auth_token=[\w-]{43}; Max-Age=34560000; Path=\/; Expires=.+; Secure; SameSite=Lax$/,
      ),
    ]);
    const token = cookies[0].split(';')[0].replace('auth_token=', '');

    const authenticationRows = await AuthenticationQuery.findAll();
    expect(authenticationRows).toHaveLength(1);
    expect(authenticationRows[0]).toStrictEqual({
      id: authentication.id,
      userExternalId: 'user-1',
      magicToken: null,
      successUrl: null,
      token: tokenProvider.hash(token),
      userAgent: 'user-agent-1',
      authenticatedAt: new Date('2026-09-04T12:30:45.000Z'),
      lastUsedAt: new Date('2026-09-04T12:30:45.000Z'),
      expiresAt: new Date('2026-10-04T12:30:45.000Z'),
    });
  });

  it('expired', async () => {
    const authentication = AuthenticationFactory.create(
      tokenProvider.hash('magic-token-1'),
      new Date('2026-09-04T12:20:44.000Z'),
    );
    await repository.add(authentication);

    await request(app.getHttpServer())
      .get('/authenticate?magicToken=magic-token-1')
      .expect(HttpStatus.FOUND)
      .expect('Location', '/error');
  });
});
