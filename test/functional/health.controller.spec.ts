import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';

import { createApplication } from '../support/application.js';

describe('HealthController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApplication();
  });

  afterEach(() => app.close());

  it('check', () =>
    request(app.getHttpServer()).get('/health').expect(HttpStatus.NO_CONTENT));
});
