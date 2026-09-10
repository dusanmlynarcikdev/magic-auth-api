import { Module } from '@nestjs/common';
import AuthenticationAuthenticateController from './authenticate/controller.js';
import AuthenticationAuthenticateUseCase from './authenticate/use-case.js';
import AuthenticationCreateController from './create/controller.js';
import AuthenticationCreateUseCase from './create/use-case.js';
import AuthenticationDeleteMeController from './me/delete.controller.js';
import AuthenticationDeleteMeUseCase from './me/delete.use-case.js';
import AuthenticationGetMeController from './me/get.controller.js';
import AuthenticationGuard from './guard.js';
import AuthenticationListController from './list.controller.js';
import AuthenticationRepository from './repository.js';
import ClockProvider from '../clock.provider.js';
import TokenProvider from '../token.provider.js';

@Module({
  controllers: [
    AuthenticationAuthenticateController,
    AuthenticationCreateController,
    AuthenticationDeleteMeController,
    AuthenticationGetMeController,
    AuthenticationListController,
  ],
  providers: [
    AuthenticationAuthenticateUseCase,
    AuthenticationCreateUseCase,
    AuthenticationDeleteMeUseCase,
    AuthenticationGuard,
    AuthenticationRepository,
    ClockProvider,
    TokenProvider,
  ],
})
export default class AuthenticationModule {}
