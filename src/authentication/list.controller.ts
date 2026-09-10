import { Controller, Get, UseGuards } from '@nestjs/common';
import { Auth } from './decorators.js';
import Authentication from './entity.js';
import AuthenticationGuard from './guard.js';
import AuthenticationRepository from './repository.js';
import type { AuthenticationDto } from './dtos.js';
import ClockProvider from '../clock.provider.js';

@Controller('authentications')
@UseGuards(AuthenticationGuard)
export default class AuthenticationListController {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly clockProvider: ClockProvider,
  ) {}

  @Get()
  async list(
    @Auth() authentication: Authentication,
  ): Promise<AuthenticationDto[]> {
    return this.authenticationRepository.findUnexpiredWithTokenByUserExternalId(
      authentication.userExternalId,
      this.clockProvider.now(),
    );
  }
}
