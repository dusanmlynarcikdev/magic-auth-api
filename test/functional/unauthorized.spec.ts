import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { createApplication } from '../support/application.js';

const paths: ['get' | 'post', string][] = [['get', '/authentications/me']];

describe('unauthorized', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  describe.each(paths)('%s %s', (method, path) => {
    it('missing bearer token', () =>
      request(app.getHttpServer())
        [method](path)
        .expect(HttpStatus.UNAUTHORIZED));

    it('unknown token', () =>
      request(app.getHttpServer())
        [method](path)
        .set('Authorization', 'Bearer token-1')
        .expect(HttpStatus.UNAUTHORIZED));
  });
});
