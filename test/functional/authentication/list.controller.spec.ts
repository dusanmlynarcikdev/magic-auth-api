import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';

import AuthenticationRepository from '../../../src/authentication/repository.js';
import TokenProvider from '../../../src/token.provider.js';
import { createApplication } from '../../support/application.js';
import AuthenticationFactory from '../../support/authentication/factory.js';

describe('AuthenticationListController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it('list', async () => {
    const tokenProvider = new TokenProvider();
    const repository = new AuthenticationRepository();
    const authentication = AuthenticationFactory.authenticated(
      tokenProvider.hash('token-1'),
    );
    await repository.add(authentication);

    const response = await request(app.getHttpServer())
      .get('/authentications')
      .set('Authorization', 'Bearer token-1')
      .expect(HttpStatus.OK);

    expect(response.body).toStrictEqual([
      {
        id: authentication.id,
        authenticatedAt: '2026-09-04T12:30:45.000Z',
        expiresAt: '2026-10-04T12:30:45.000Z',
      },
    ]);
  });
});
