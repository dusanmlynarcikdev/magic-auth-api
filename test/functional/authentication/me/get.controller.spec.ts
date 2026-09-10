import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import AuthenticationRepository from '../../../../src/authentication/repository.js';
import { createApplication } from '../../../support/application.js';
import AuthenticationFactory from '../../../support/authentication/factory.js';
import TokenProvider from '../../../../src/token.provider.js';

describe('AuthenticationGetMeController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it('get me', async () => {
    await new AuthenticationRepository().add(
      AuthenticationFactory.authenticated(new TokenProvider().hash('token-1')),
    );

    const response = await request(app.getHttpServer())
      .get('/authentications/me')
      .set('Authorization', 'Bearer token-1')
      .expect(HttpStatus.OK);

    expect(response.body).toStrictEqual({ userExternalId: 'user-1' });
  });
});
