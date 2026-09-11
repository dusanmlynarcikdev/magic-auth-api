import { Module } from '@nestjs/common';

import ClockProvider from '../clock.provider.js';
import TokenProvider from '../token.provider.js';
import AuthenticationAuthenticateController from './authenticate/controller.js';
import AuthenticationAuthenticateUseCase from './authenticate/use-case.js';
import AuthenticationCreateController from './create/controller.js';
import AuthenticationCreateUseCase from './create/use-case.js';
import AuthenticationDeleteController from './delete/controller.js';
import AuthenticationDeleteExpiredTask from './delete/expired/task.js';
import AuthenticationDeleteExpiredUseCase from './delete/expired/use-case.js';
import AuthenticationDeleteUseCase from './delete/use-case.js';
import AuthenticationGuard from './guard.js';
import AuthenticationListController from './list.controller.js';
import AuthenticationDeleteMeController from './me/delete.controller.js';
import AuthenticationDeleteMeUseCase from './me/delete.use-case.js';
import AuthenticationGetMeController from './me/get.controller.js';
import AuthenticationRepository from './repository.js';

@Module({
  controllers: [
    AuthenticationAuthenticateController,
    AuthenticationCreateController,
    AuthenticationDeleteMeController,
    AuthenticationDeleteController,
    AuthenticationGetMeController,
    AuthenticationListController,
  ],
  providers: [
    AuthenticationAuthenticateUseCase,
    AuthenticationCreateUseCase,
    AuthenticationDeleteMeUseCase,
    AuthenticationDeleteExpiredTask,
    AuthenticationDeleteExpiredUseCase,
    AuthenticationDeleteUseCase,
    AuthenticationGuard,
    AuthenticationRepository,
    ClockProvider,
    TokenProvider,
  ],
})
export default class AuthenticationModule {}
