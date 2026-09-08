import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types.js';
import { AppModule } from '../../src/app.module.js';
import ClockProvider from '../../src/clock.provider.js';
import AuthenticationFactory from './authentication.factory.js';

export async function createApplication(
  now: Date = AuthenticationFactory.NOW,
): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ClockProvider)
    .useValue({ now: () => now })
    .compile();

  const application =
    moduleFixture.createNestApplication<INestApplication<App>>();
  await application.init();

  return application;
}
