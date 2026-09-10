import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import AuthenticationRepository from '../../../../src/authentication/repository.js';
import { createApplication } from '../../../support/application.js';
import AuthenticationFactory from '../../../support/authentication/factory.js';
import AuthenticationQuery from '../../../support/authentication/query.js';
import TokenProvider from '../../../../src/token.provider.js';

describe('AuthenticationDeleteMeController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it('delete me', async () => {
    await new AuthenticationRepository().add(
      AuthenticationFactory.authenticated(new TokenProvider().hash('token-1')),
    );

    await request(app.getHttpServer())
      .delete('/authentications/me')
      .set('Authorization', 'Bearer token-1')
      .expect(HttpStatus.NO_CONTENT);

    expect(await AuthenticationQuery.findAll()).toHaveLength(0);
  });
});
