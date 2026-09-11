import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';

import AuthenticationRepository from '../../../src/authentication/repository.js';
import TokenProvider from '../../../src/token.provider.js';
import { createApplication } from '../../support/application.js';
import AuthenticationFactory from '../../support/authentication/factory.js';
import AuthenticationQuery from '../../support/authentication/query.js';

describe('AuthenticationAuthenticateController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it('authenticate', async () => {
    const repository = new AuthenticationRepository();
    const tokenProvider = new TokenProvider();

    const authentication = AuthenticationFactory.create(
      tokenProvider.hash('magic-token-1'),
    );
    await repository.add(authentication);

    const response = await request(app.getHttpServer())
      .post('/authentications/authenticate')
      .send({ magicToken: 'magic-token-1' })
      .expect(HttpStatus.OK);

    expect(response.body).toStrictEqual({
      token: expect.stringMatching(/^[\w-]{43}$/),
    });

    const authenticationRows = await AuthenticationQuery.findAll();
    expect(authenticationRows).toHaveLength(1);
    expect(authenticationRows[0]).toStrictEqual({
      id: authentication.id,
      userExternalId: 'user-1',
      magicToken: null,
      token: tokenProvider.hash(response.body.token),
      authenticatedAt: new Date('2026-09-04T12:30:45.000Z'),
      expiresAt: new Date('2026-10-04T12:30:45.000Z'),
    });
  });
});
