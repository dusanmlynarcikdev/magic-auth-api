import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { createApplication } from '../support/application.js';

const paths: ['get', string][] = [['get', '/authentications/me']];

describe('unauthorized', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it.each(paths)(
    'without Authorization header: %s %s',
    async (method, path) => {
      await request(app.getHttpServer())
        [method](path)
        .expect(HttpStatus.UNAUTHORIZED);
    },
  );
});
