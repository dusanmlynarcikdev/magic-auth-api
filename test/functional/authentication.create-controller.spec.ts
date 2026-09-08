import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import AuthenticationFactory from '../support/authentication.factory.js';
import { createApplication } from '../support/application.js';
import AuthenticationQuery from '../support/authentication.query.js';

describe('AuthenticationCreateController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it('create', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentications')
      .send({ userExternalId: 'user-1' })
      .expect(HttpStatus.CREATED);

    expect(response.body).toStrictEqual({
      magicToken: expect.stringMatching(AuthenticationFactory.TOKEN_REGEX),
    });

    const authenticationRows = await AuthenticationQuery.findAll();
    expect(authenticationRows).toHaveLength(1);
    expect(authenticationRows[0]).toStrictEqual({
      id: expect.any(String),
      userExternalId: 'user-1',
      magicToken: response.body.magicToken,
      token: null,
      authenticatedAt: null,
      expiresAt: new Date('2026-09-04T12:40:45.000Z'),
    });
  });
});
