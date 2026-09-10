import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { createApplication } from '../support/application.js';

const paths: ['get' | 'delete', string][] = [
  ['get', '/authentications'],
  ['get', '/authentications/me'],
  ['delete', '/authentications/me'],
  ['delete', '/authentications/00000000-0000-0000-0000-000000000000'],
];

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
