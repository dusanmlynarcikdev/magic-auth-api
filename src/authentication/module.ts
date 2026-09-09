import { Module } from '@nestjs/common';
import AuthenticationAuthenticateController from './authenticate/controller.js';
import AuthenticationAuthenticateUseCase from './authenticate/use-case.js';
import AuthenticationCreateController from './create/controller.js';
import AuthenticationCreateUseCase from './create/use-case.js';
import AuthenticationRepository from './repository.js';
import ClockProvider from '../clock.provider.js';
import TokenProvider from '../token.provider.js';

@Module({
  controllers: [
    AuthenticationAuthenticateController,
    AuthenticationCreateController,
  ],
  providers: [
    AuthenticationAuthenticateUseCase,
    AuthenticationCreateUseCase,
    AuthenticationRepository,
    ClockProvider,
    TokenProvider,
  ],
})
export default class AuthenticationModule {}
