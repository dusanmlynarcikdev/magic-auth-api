import { Module } from '@nestjs/common';
import AuthenticationCreateController from './authentication.create-controller.js';
import AuthenticationCreateUseCase from './authentication.create-use-case.js';
import AuthenticationRepository from './authentication.repository.js';
import ClockProvider from './clock.provider.js';

@Module({
  imports: [],
  controllers: [AuthenticationCreateController],
  providers: [
    AuthenticationCreateUseCase,
    AuthenticationRepository,
    ClockProvider,
  ],
})
export default class AuthenticationModule {}
