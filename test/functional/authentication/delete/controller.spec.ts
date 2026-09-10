import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import AuthenticationRepository from '../../../../src/authentication/repository.js';
import { createApplication } from '../../../support/application.js';
import AuthenticationFactory from '../../../support/authentication/factory.js';
import AuthenticationQuery from '../../../support/authentication/query.js';
import TokenProvider from '../../../../src/token.provider.js';

describe('AuthenticationDeleteController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it('delete', async () => {
    const repository = new AuthenticationRepository();
    const tokenProvider = new TokenProvider();
    const authentication = AuthenticationFactory.authenticated(
      tokenProvider.hash('token-1'),
    );
    await repository.add(authentication);

    await request(app.getHttpServer())
      .delete(`/authentications/${authentication.id}`)
      .set('Authorization', 'Bearer token-1')
      .expect(HttpStatus.NO_CONTENT);

    const rows = await AuthenticationQuery.findAll();
    expect(rows).toHaveLength(0);
  });
});
