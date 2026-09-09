import { Module } from '@nestjs/common';
import AuthenticationCreateController from './create.controller.js';
import AuthenticationCreateUseCase from './create.use-case.js';
import AuthenticationRepository from './repository.js';
import ClockProvider from '../clock.provider.js';

@Module({
  controllers: [AuthenticationCreateController],
  providers: [
    AuthenticationCreateUseCase,
    AuthenticationRepository,
    ClockProvider,
  ],
})
export default class AuthenticationModule {}
