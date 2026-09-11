import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import AuthenticationModule from './authentication/module.js';
import HealthController from './health.controller.js';

@Module({
  imports: [AuthenticationModule, ScheduleModule.forRoot()],
  controllers: [HealthController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
