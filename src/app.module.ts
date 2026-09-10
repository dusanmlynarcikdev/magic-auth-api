import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import HealthController from './health.controller.js';
import AuthenticationModule from './authentication/module.js';

@Module({
  imports: [AuthenticationModule],
  controllers: [HealthController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
