import { Module } from '@nestjs/common';
import AuthenticationCreateController from './authentication.create-controller.js';
import AuthenticationCreateUseCase from './authentication.create-use-case.js';
import AuthenticationRepository from './authentication.repository.js';

@Module({
  imports: [],
  controllers: [AuthenticationCreateController],
  providers: [AuthenticationCreateUseCase, AuthenticationRepository],
})
export default class AuthenticationModule {}
